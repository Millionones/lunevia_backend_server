// Seeds (or updates) the single admin user used to log into the CMS.
// Usage: `npm run seed:admin` (reads SEED_ADMIN_* from the environment).
import "dotenv/config";
import mongoose from "mongoose";
import chalk from "chalk";
import { DATABASE_URL } from "../config.js";
import model from "../model/index.js";

const email = process.env.SEED_ADMIN_EMAIL || "admin@lunevia.com";
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME || "Admin";

async function run() {
  if (!password) {
    console.error(
      chalk.red("SEED_ADMIN_PASSWORD is not set. Refusing to seed with a blank/default password.")
    );
    process.exit(1);
  }

  await mongoose.connect(DATABASE_URL, { connectTimeoutMS: 30000 });
  console.log(chalk.whiteBright("Database connection established"));

  const user = new model.User();
  const hash = user.generatePasswordHash(password);

  const existing = await model.User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.password = hash;
    existing.status = 0;
    await existing.save();
    console.log(chalk.greenBright(`Updated existing admin: ${email}`));
  } else {
    await model.User.create({ name, email, password: hash, status: 0 });
    console.log(chalk.greenBright(`Created admin: ${email}`));
  }

  // Idempotently seed default service categories so the CMS `common/category`
  // Select has options to show.
  const defaultServiceCategories = [
    { type: "service", label: "Wellness", value: "wellness" },
    { type: "service", label: "Dining", value: "dining" },
    { type: "service", label: "Adventure", value: "adventure" },
    { type: "service", label: "Events", value: "events" },
  ];

  for (const cat of defaultServiceCategories) {
    const found = await model.category.findOne({ type: cat.type, value: cat.value });
    if (!found) {
      await model.category.create(cat);
      console.log(chalk.cyanBright(`Seeded category: ${cat.type}/${cat.value}`));
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(chalk.red("Seed failed:"), err.message);
  process.exit(1);
});
