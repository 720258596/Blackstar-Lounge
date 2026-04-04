import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── MENU ITEMS ──────────────────────────────────────────────
  await prisma.menuItem.createMany({
    data: [
      { name: "Tusker Lager",          category: "drinks",    price: "KSh 350",   description: "Cold crisp Kenyan lager" },
      { name: "Whiskey Neat",          category: "drinks",    price: "KSh 800",   description: "Premium single malt served neat" },
      { name: "Vodka Soda",            category: "drinks",    price: "KSh 650",   description: "Clean, refreshing, ice cold" },
      { name: "Red Wine",              category: "drinks",    price: "KSh 900",   description: "Curated selection of reds" },
      { name: "Black Star Signature",  category: "cocktails", price: "KSh 1,200", description: "Aged rum, gold syrup, citrus, smoked rim", isFeatured: true },
      { name: "Midnight Passion",      category: "cocktails", price: "KSh 1,100", description: "Passion fruit, vodka, lime, ginger beer",   isFeatured: true },
      { name: "Gold Rush",             category: "cocktails", price: "KSh 1,300", description: "Bourbon, honey, lemon, thyme sprig",         isFeatured: true },
      { name: "Nairobi Nights",        category: "cocktails", price: "KSh 1,000", description: "Gin, tonic, cucumber, black pepper" },
      { name: "Chicken Wings",         category: "food",      price: "KSh 850",   description: "Smoky BBQ or buffalo, 10 pieces" },
      { name: "Club Fries",            category: "food",      price: "KSh 450",   description: "Crispy seasoned fries with dipping sauce" },
      { name: "Beef Sliders",          category: "food",      price: "KSh 1,100", description: "Wagyu beef, truffle mayo, pickles" },
      { name: "Nachos Platter",        category: "food",      price: "KSh 750",   description: "Loaded nachos, guacamole, salsa, cheese" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Menu items seeded");

  // ── EVENTS ───────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title:       "DJ Crème de la Crème",
        description: "The finest Afro-house sets all night long",
        date:        new Date("2025-04-04T21:00:00"),
        isActive:    true,
      },
      {
        title:       "EPL: Man City vs Arsenal",
        description: "Live on our giant screens with full bar",
        date:        new Date("2025-04-06T14:00:00"),
        isActive:    true,
      },
      {
        title:       "Acoustic Night",
        description: "Live acoustic sets from Kenya's finest artists",
        date:        new Date("2025-04-12T19:00:00"),
        isActive:    true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Events seeded");

  // ── PROMOTIONS ───────────────────────────────────────────────
  await prisma.promotion.createMany({
    data: [
      { title: "Live DJ Night",            detail: "Every Friday",    isActive: true },
      { title: "Sports Screening",         detail: "Matchdays Live",  isActive: true },
      { title: "Happy Hour",               detail: "5 PM – 8 PM",    isActive: true },
      { title: "Live Artist Performance",  detail: "This Saturday",   isActive: true },
      { title: "Free WiFi",                detail: "Connect & Enjoy", isActive: true },
      { title: "Premium Cocktails",        detail: "Signature Blends",isActive: true },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Promotions seeded");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });