/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  console.log("🚀 Seeding s3bucketsettings...");

  const collection = db.collection("s3bucketsettings");

  const requiredEnv = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_S3_BUCKET",
    "AWS_DISPLAY_URL",
    "AWS_REGION",
  ];

  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`❌ Missing ENV variables: ${missing.join(", ")}`);
  }

  const data = {
    s3key: process.env.AWS_ACCESS_KEY_ID,
    s3secret: process.env.AWS_SECRET_ACCESS_KEY,
    s3bucket_name: process.env.AWS_S3_BUCKET,
    s3display_url: process.env.AWS_DISPLAY_URL,
    region: process.env.AWS_REGION,
  };

  const now = new Date();

  await collection.updateOne(
    {},
    {
      $setOnInsert: {
        createdAt: now,
      },
      $set: {
        ...data,
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  console.log("✅ s3bucketsettings seeded/updated successfully");
};
