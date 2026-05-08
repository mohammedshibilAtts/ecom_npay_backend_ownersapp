/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    console.log("🚀 Seeding staffusers started...");

    const userNamesStr = process.env.USER_NAME;
    if (!userNamesStr) {
      console.log("❌ USER_NAME not found in .env. Seeder stopped.");
      return;
    }

    const userNames = JSON.parse(userNamesStr);
    const pass1 = process.env.PASS1;
    const pass2 = process.env.PASS2;

    if (!pass1 || !pass2) {
      console.log("❌ PASS1 or PASS2 not found in .env. Seeder stopped.");
      return;
    }

    const collection = db.collection("staffusers");
    const rolesCollection = db.collection("userroles");
    const branchCollection = db.collection("branches");

    const branch = await branchCollection.findOne({});

    for (const userName of userNames) {
      const alreadyExists = await collection.findOne({ username: userName });

      if (alreadyExists) {
        console.log(`⚠️ Staffuser '${userName}' already exists. Skipping...`);
        continue;
      }

      let password, idRoleVal;
      if (userName === "admin") {
        password = pass1;
        idRoleVal = 2;
      } else if (userName === "superadmin") {
        password = pass2;
        idRoleVal = 1;
      } else {
        console.log(`⚠️ Unknown user type '${userName}'. Skipping...`);
        continue;
      }

      const role = await rolesCollection.findOne({ id_role: idRoleVal });

      await collection.insertOne({
        username: userName,
        password: password,
        active: true,
        is_deleted: false,
        access_branch: "0",
        // id_employee: "6884eb4319c02da61fc1d32b",
        id_role: role?._id,
        id_branch: branch?._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Staffuser inserted: ${userName}`);
    }
  } catch (error) {
    console.error("🔥 Error while seeding staffusers:", error.message);
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
    console.log("↩️ Rolling back staffusers seed...");

    const userNamesStr = process.env.USER_NAME;
    if (!userNamesStr) {
      console.log("❌ USER_NAME not found in .env. Rollback skipped.");
      return;
    }

    const userNames = JSON.parse(userNamesStr);
    const collection = db.collection("staffusers");

    for (const userName of userNames) {
      const result = await collection.deleteOne({ username: userName });

      if (result.deletedCount === 0) {
        console.log(`⚠️ No staffuser found to rollback for: ${userName}`);
      } else {
        console.log(`✅ Rollback done. Deleted staffuser: ${userName}`);
      }
    }
  } catch (error) {
    console.error("🔥 Error while rollback staffusers:", error.message);
    throw error;
  }
};
  