// Curated, always-available knowledge baseline for Luna.
//
// Why this exists: buildKnowledge() aggregates FAQs from live CMS collections
// only. The real Crown Woods Munnar FAQ copy, however, ships as *frontend*
// defaults (Lunevia/helpers/pageDefaults.js -> faq.groups) and never reaches
// the backend aggregator, so on a fresh/unseeded database Luna knows nothing
// beyond the static BRAND blurb. These constants give Luna a dependable
// baseline; CMS-authored FAQs are merged on top and take precedence (see the
// dedup in controllers/luna.controller.js).
//
// Keep WEBSITE_FAQS in sync with pageDefaults.js faq.groups. WEBSITE_FACTS is
// kept intentionally generic/accurate — anything property-specific and
// changeable (exact times, rates) defers the guest to the team.

// The 9 public FAQ answers, copied verbatim from the frontend faq defaults.
export const WEBSITE_FAQS = [
    {
        heading: "General Questions",
        q: "How can I get room availability?",
        a: "Fill in the form in the upper right corner or click “Check prices” next to the room you like. Once you indicated your booking details, click on the “Check Availability” button, and all the available rooms with a variety of rates will be shown below.",
    },
    {
        heading: "General Questions",
        q: "Is breakfast included in the price?",
        a: "It depends on the rate you choose. In general, information about breakfast is provided in rate details.",
    },
    {
        heading: "General Questions",
        q: "How to make a reservation?",
        a: "Click a “Book” button next to the room rate you like. You will be immediately directed to a reservation page. Enter the required details and get your booking confirmation in a moment. You will also receive an instant booking confirmation on your email.",
    },
    {
        heading: "General Questions",
        q: "What personal details should I provide?",
        a: "In order to make a reservation, you need to provide the guest's full name, e-mail address and phone number. If you choose the rate under prepayment terms, you need to enter the card number, card holder's name and CVV code. The payment process on our website is secure. Your personal data and every step of the booking process are protected with international security protocols.",
    },
    {
        heading: "General Questions",
        q: "When and how do I receive my booking confirmation?",
        a: "Once the reservation is made, the confirmation page will be shown. Additionally, a letter of confirmation will be sent to your email.",
    },
    {
        heading: "General Questions",
        q: "What are my payment options?",
        a: "The information concerning payment might vary depending on a room and a rate you choose. A free cancellation booking can be canceled free of charge before the cancellation deadline. A non-refundable booking is usually a cheaper option, but requires a cancellation fee.",
    },
    {
        heading: "General Questions",
        q: "Can I make a reservation with a special request?",
        a: "You can send a special request to the hotel via the “Special requests” field on the reservation page or by contacting the hotel directly. However, we cannot guarantee that your request will be fulfilled. If you submit a special request, please wait for a call or an email from the hotel to get an update on your issue.",
    },
    {
        heading: "Cancellation and Refund related",
        q: "How can I cancel my reservation?",
        a: "You can cancel your booking by following instructions in your confirmation e-mail. Please note that if the rate is non-refundable or the cancellation deadline has already passed, then the paid sum cannot be refunded.",
    },
    {
        heading: "Cancellation and Refund related",
        q: "Can I get a refund after my reservation is cancelled?",
        a: "If cancellation of your booking involves full or partial refund, the funds will be reimbursed to your credit card within 1-2 days.",
    },
];

// Curated "website"-level facts so Luna can speak to the property itself even
// before any destination/room content is created in the CMS.
export const WEBSITE_FACTS = [
    {
        heading: "About Crown Woods Munnar",
        q: "What is Crown Woods Munnar?",
        a: "Crown Woods Munnar by Lunevia is a boutique retreat set amid the tea-clad hills and misty forests of Munnar, Kerala. It offers curated rooms, warm personal service and immersive experiences, with design, nature and hospitality meeting in every detail.",
    },
    {
        heading: "About Crown Woods Munnar",
        q: "Where is Crown Woods Munnar located?",
        a: "The property is in Munnar, a hill station in the Western Ghats of Kerala, India, surrounded by tea plantations and forest.",
    },
    {
        heading: "About Crown Woods Munnar",
        q: "How do I reach Munnar?",
        a: "The nearest airport is Cochin International Airport (COK), roughly a 3.5–4 hour drive away. The closest major railway stations are at Ernakulam / Aluva. From Kochi you reach Munnar by road via Adimali. If you'd like directions or help arranging a transfer, just reach out to our team.",
    },
    {
        heading: "About Crown Woods Munnar",
        q: "What experiences and surroundings can I expect?",
        a: "Munnar is known for its rolling tea gardens, misty forests and cool mountain air. Crown Woods pairs that setting with intentional, design-led stays and immersive experiences — perfect for a restful, nature-immersed getaway.",
    },
    {
        heading: "About Crown Woods Munnar",
        q: "What rooms are available?",
        a: "Crown Woods offers a selection of curated rooms designed around comfort and the surrounding landscape. For current room types, availability and rates, use the booking form on the website or contact our team directly.",
    },
    {
        heading: "About Crown Woods Munnar",
        q: "How do I book or contact you?",
        a: "You can book through the website's booking form, or reach us directly by phone/WhatsApp at +91 6238899339 or by email at luneviaEnquiry@gmail.com. We're happy to help with availability, special requests and trip planning.",
    },
];
