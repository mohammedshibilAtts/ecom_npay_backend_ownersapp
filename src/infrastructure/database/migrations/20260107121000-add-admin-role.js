export const up = async (db, client) => {
  const existingUser = await db
    .collection("users")
    .findOne({ email: "admin@gmail.com" });

  if (!existingUser) {
    await db.collection("users").insertOne({
      name: "admin",
      email: "admin@gmail.com",
      password: "$2a$12$GJqn73CH5qZIk6jFIVPpGO5ChXKzILga6k08JdwoidTUOkkStelvm",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });
    console.log("Admin user created via migration");
  } else {
    console.log("Admin user already exists");
  }
};

export const down = async (db, client) => {
  // Optional: Delete the admin user on rollback, or leave it.
  // Generally safe to leave data unless strict cleanup is required.
  // await db.collection("users").deleteOne({ email: "admin@gmail.com" });
};
