import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import { stripHtml, unwantedFields } from "../helper/functions.js";
import { WEBSITE_FAQS, WEBSITE_FACTS } from "../data/luna-knowledge.js";

// How long a stored knowledge doc is trusted before the public read lazily
// rebuilds it from live CMS data (keeps Luna in sync without a cron job).
const TTL_MS = 60 * 60 * 1000; // 60 minutes

// Static brand blurb — there is no brand table. Kept here so Luna always has a
// baseline "about" answer even before any CMS content exists.
const BRAND = {
    name: "Lunevia",
    tagline:
        "Spaces where architecture meets landscape, culture meets comfort, and every detail is intentional.",
    about:
        "Lunevia crafts intentional stays where design, nature and hospitality meet. Our flagship destination is Crown Woods Munnar by Lunevia — a boutique retreat set amid the tea-clad hills and misty forests of Munnar, Kerala, offering curated rooms, warm service and immersive experiences.",
    property: {
        name: "Crown Woods Munnar by Lunevia",
        location: "Munnar, Kerala, India",
    },
    contact: {
        phone: "+91 6238899339",
        whatsapp: "+916238899339",
        email: "luneviaEnquiry@gmail.com",
    },
};

// Turn a question into a small set of lowercase keyword tags used by the
// frontend matcher. Drops short words and common stopwords.
const STOPWORDS = new Set([
    "the", "and", "for", "are", "was", "you", "your", "our", "how", "what",
    "when", "where", "does", "will", "can", "with", "about", "have", "has",
    "there", "this", "that", "from", "any", "all", "into", "out", "not", "but",
]);
const toTags = (text = "") =>
    Array.from(
        new Set(
            String(text)
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, " ")
                .split(/\s+/)
                .filter((w) => w.length > 2 && !STOPWORDS.has(w))
        )
    );

// Normalize a question for dedup: lowercase, drop punctuation, collapse spaces.
const normQ = (q = "") =>
    String(q).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Aggregate the whole Luna knowledge base from live collections.
const buildKnowledge = async () => {
    const faqs = [];

    // 1. FAQs embedded in services.
    const services = await model.service
        .find({ status: 0 })
        .select("name faq")
        .lean();
    for (const svc of services) {
        for (const item of svc?.faq || []) {
            const q = stripHtml(item?.question);
            const a = stripHtml(item?.answer);
            if (q && a) faqs.push({ q, a, tags: toTags(`${q} ${svc?.name || ""}`) });
        }
    }

    // 2. FAQs stored on the "faq" CMS page (content.groups[].items[] => {q,a}).
    const faqPage = await model.pageContent
        .findOne({ page: "faq", status: 0 })
        .select("content")
        .lean();
    for (const group of faqPage?.content?.groups || []) {
        for (const item of group?.items || []) {
            const q = stripHtml(item?.q ?? item?.question);
            const a = stripHtml(item?.a ?? item?.answer);
            if (q && a) faqs.push({ q, a, tags: toTags(`${q} ${group?.heading || ""}`) });
        }
    }

    // 2b. Curated baseline (real Crown Woods FAQs + website facts). CMS-authored
    // FAQs above win; the baseline only fills questions the CMS hasn't answered,
    // so Luna always knows the essentials even on a fresh/unseeded database.
    const seen = new Set(faqs.map((f) => normQ(f.q)));
    for (const item of [...WEBSITE_FAQS, ...WEBSITE_FACTS]) {
        const q = stripHtml(item?.q);
        const a = stripHtml(item?.a);
        if (!q || !a || seen.has(normQ(q))) continue;
        seen.add(normQ(q));
        faqs.push({ q, a, tags: toTags(`${q} ${item?.heading || ""}`) });
    }

    // 3. Destinations + their embedded rooms.
    const dests = await model.destination
        .find({ status: 0 })
        .select("title slug aboutProperty roomDetails")
        .lean();

    const destinations = [];
    const rooms = [];
    for (const d of dests) {
        destinations.push({
            title: d?.title || "",
            slug: d?.slug || "",
            description: stripHtml(d?.aboutProperty?.description),
        });
        for (const r of d?.roomDetails || []) {
            rooms.push({
                title: r?.title || "",
                description: stripHtml(r?.description),
                price: r?.price ?? 0,
                features: (r?.features || [])
                    .map((f) => stripHtml(f?.label ? `${f.label}: ${f.answer || ""}` : f?.answer))
                    .filter(Boolean),
                destinationTitle: d?.title || "",
                destinationSlug: d?.slug || "",
                roomSlug: r?.slug || "",
            });
        }
    }

    return { brand: BRAND, faqs, rooms, destinations };
};

// Rebuild + upsert the single knowledge doc. Exposed as an admin-only endpoint
// and reused by the seed script and the lazy public read.
export const rebuild = asyncErrorHandler(async () => {
    const content = await buildKnowledge();

    const data = await model.luna
        .findOneAndUpdate(
            { key: "knowledge", status: 0 },
            { $set: { content } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        .select(unwantedFields())
        .lean();

    return new Response("Luna knowledge rebuilt successfully", { data }, 200);
});

// Public read consumed by the website widget. Serves the stored doc; if it is
// missing or older than the TTL, rebuilds first so content stays fresh.
export const getKnowledge = asyncErrorHandler(async () => {
    let doc = await model.luna.findOne({ key: "knowledge", status: 0 });

    const stale =
        !doc ||
        !doc.content ||
        !doc.updatedAt ||
        Date.now() - new Date(doc.updatedAt).getTime() > TTL_MS;

    if (stale) {
        const content = await buildKnowledge();
        doc = await model.luna.findOneAndUpdate(
            { key: "knowledge", status: 0 },
            { $set: { content } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
    }

    return new Response("success", { data: doc?.content ?? {} }, 200);
});

export { buildKnowledge };
