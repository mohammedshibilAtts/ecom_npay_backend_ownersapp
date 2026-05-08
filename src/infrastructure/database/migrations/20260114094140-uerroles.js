export const up = async (db) => {
    console.log("🚀 Seeding User Roles via Native MongoDB");
  
    const roles = [
      { id_role: 1, role_name: "SUPER ADMIN", active: false, is_deleted: true },
      { id_role: 2, role_name: "ADMIN", active: true, is_deleted: false },
      { id_role: 3, role_name: "BRANCH", active: true, is_deleted: false },
      { id_role: 4, role_name: "BILLING", active: true, is_deleted: false },
      { id_role: 5, role_name: "SALES", active: true, is_deleted: false },
    ];
  
    const collection = db.collection("userroles");
  
    for (const role of roles) {
      const exists = await collection.findOne({ id_role: role.id_role });
  
      if (!exists) {
        await collection.insertOne({
          ...role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Role inserted: ${role.role_name}`);
      } else {
        console.log(`⚠️ Role already exists: ${role.role_name}`);
      }
    }
  };
  