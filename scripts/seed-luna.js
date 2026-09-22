// Builds (or refreshes) the single Luna knowledge document from the live CMS
// data, so the assistant table is populated on first deploy without waiting for
// the lazy public-read path. Usage: `npm run seed:luna`.
import "dotenv/config";
import mongoose from "mongoose";
import chalk from "chalk";
import { DATABASE_URL } from "../config.js";
import model from "../model/index.js";
import { buildKnowledge } from "../controllers/luna.controller.js";

async function run() {
    await mongoose.connect(DATABASE_URL, { connectTimeoutMS: 30000 });
    console.log(chalk.whiteBright("Database connection established"));

    const content = await buildKnowledge();

    await model.luna.findOneAndUpdate(
        { key: "knowledge", status: 0 },
        { $set: { content } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(
        chalk.greenBright(
            `Seeded Luna knowledge: ${content.faqs.length} FAQs, ${content.rooms.length} rooms, ${content.destinations.length} destinations`
        )
    );

    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error(chalk.red("Luna seed failed:"), err.message);
    process.exit(1);
});
