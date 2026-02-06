const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jehcuf6.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const userCollection = db.collection("users");

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 3000}`,
      );
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;

        const result = await userCollection.insertOne(userData);

        res.status(201).json({
          message: "User created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
