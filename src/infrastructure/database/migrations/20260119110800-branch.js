import "dotenv/config";

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    console.log("🚀 Seeding branches started...");

    const BRANCH_NAME = process.env.BRANCH_NAME;
    if (!BRANCH_NAME) {
      console.log("❌ BRANCH_NAME not found in .env. Seeder stopped.");
      return;
    }

    let branchNames = [];
    try {
      branchNames = JSON.parse(BRANCH_NAME);
    } catch (err) {
      console.log("❌ BRANCH_NAME must be a valid JSON array. Example: [\"Branch1\",\"Branch2\"]");
      return;
    }

    if (!Array.isArray(branchNames) || branchNames.length === 0) {
      console.log("❌ BRANCH_NAME should be a non-empty array.");
      return;
    }

    const collection = db.collection("branches");
    const countryCollection = db.collection('countries')
    const stateCollection = db.collection("states");
    const cityCollection = db.collection("cities")

    const formattedBranches = branchNames
      .map((b) => (typeof b === "string" ? b.trim() : ""))
      .filter(Boolean);

    for (const branch of formattedBranches) {
      const alreadyExists = await collection.findOne({ branch_name: branch });

      if (alreadyExists) {
        console.log(`⚠️ Branch already exists: ${branch}. Skipping...`);
        continue;
      }
      const countryId = await countryCollection.findOne({ country_name: "India" });
      const stateId = await stateCollection.findOne({ state_name: "Tamil Nadu" })

      await collection.insertOne({
        branch_name: branch,
        id_country: countryId?._id,
        id_state: stateId?._id,
        active: true,
        is_deleted: false,
        branch_landline: "",
        mobile: "",
        whatsapp_no: "",
        address: "",
        pincode: "",
        email: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Inserted branch: ${branch}`);
    }

    console.log("✅ Branch seeding completed!");
  } catch (error) {
    console.error("🔥 Error while seeding branches:", error.message);
    throw error;
  }
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
  try {
    console.log("↩️ Rolling back branch seed...");

    const BRANCH_NAME = process.env.BRANCH_NAME; // ✅ same key as up()
    if (!BRANCH_NAME) {
      console.log("❌ BRANCH_NAME not found in .env. Rollback skipped.");
      return;
    }

    let branchNames = [];
    try {
      branchNames = JSON.parse(BRANCH_NAME);
    } catch (err) {
      console.log("❌ BRANCH_NAME must be a valid JSON array. Rollback skipped.");
      return;
    }

    if (!Array.isArray(branchNames) || branchNames.length === 0) {
      console.log("❌ BRANCH_NAME should be a non-empty array. Rollback skipped.");
      return;
    }

    const collection = db.collection("branches");

    const formattedBranches = branchNames
      .map((b) => (typeof b === "string" ? b.trim() : ""))
      .filter(Boolean);

    const result = await collection.deleteMany({
      branch_name: { $in: formattedBranches },
    });

    console.log(`✅ Rollback done. Deleted ${result.deletedCount} branches.`);
  } catch (error) {
    console.error("🔥 Error while rollback branches:", error.message);
    throw error;
  }
};
