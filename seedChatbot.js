import mongoose from "mongoose";
import dotenv from "dotenv";
import ChatbotItem from "./src/infrastructure/models/ecom/chatbotModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("No MONGO_URI found in .env");
  process.exit(1);
}

const seedChatbot = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.");

    // Clear existing chatbot data
    console.log("Clearing existing chatbot items...");
    await ChatbotItem.deleteMany({});

    // Create Answers (Leaf Nodes) first
    console.log("Creating leaf nodes (Answers)...");
    const ansTimings = await ChatbotItem.create({
      content: "We are open Monday to Sunday, 10:00 AM to 8:00 PM. Our showroom is located at 246/2, Madipakkam Main Road, Chennai-600091.",
      type: 2,
    });

    const ansJoin = await ChatbotItem.create({
      content: "You can join our DigiGold scheme directly through our mobile app available on the Play Store and App Store.",
      type: 2,
    });

    const ansBenefits = await ChatbotItem.create({
      content: "You unlock exclusive benefits, such as zero wastage and zero making charges on your purchases upon maturity of the scheme.",
      type: 2,
    });

    const ansReturns = await ChatbotItem.create({
      content: "Orders can be cancelled before dispatch. However, we do not offer returns or exchanges once the product has been successfully delivered. Please refer to our Terms & Conditions page for details.",
      type: 2,
    });

    // Create Sub-Questions
    console.log("Creating sub-questions...");
    const subQScheme = await ChatbotItem.create({
      content: "What would you like to know about our DigiGold schemes?",
      type: 1,
      options: [
        { label: "How to join?", nextId: ansJoin._id },
        { label: "What are the benefits?", nextId: ansBenefits._id },
      ]
    });

    // Create Root Node
    console.log("Creating root question...");
    const rootQuestion = await ChatbotItem.create({
      content: "Hello! I am the Kavitha Jewellers Virtual Assistant. How can I help you today?",
      type: 1,
      isRoot: true,
      options: [
        { label: "Store Timings & Location", nextId: ansTimings._id },
        { label: "Gold Schemes Info", nextId: subQScheme._id },
        { label: "Return & Cancellation Policy", nextId: ansReturns._id },
      ]
    });

    console.log("Successfully seeded chatbot data!");
    console.log("Root Node ID:", rootQuestion._id);

  } catch (error) {
    console.error("Error seeding chatbot data:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedChatbot();
