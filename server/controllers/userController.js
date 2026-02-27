const connectDB = require("../config/db");

exports.createUser = async (req, res) => {
  const db = await connectDB();
  const users = db.collection("users");

  const exists = await users.findOne({ email: req.body.email });

  if (exists) return res.status(409).json({ message: "Email already exists" });

  const result = await users.insertOne({
    ...req.body,
    role: "user",
  });

  res.status(201).json({
    message: "User created successfully",
    insertedId: result.insertedId,
  });
};

exports.getUserByEmail = async (req, res) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email: req.params.email });
  res.json(user || null);
};

exports.getAllUsers = async (req, res) => {
  const db = await connectDB();
  const users = await db.collection("users").find().toArray();
  res.json(users);
};
