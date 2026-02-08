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
    const ticketCollection = db.collection("tickets");

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

        const userExist = await userCollection.findOne({
          email: userData.email,
        });
        console.log("called................");

        if (userExist) {
          return res.status(409).json({
            message: "Email already exists",
          });
        }

        const result = await userCollection.insertOne({
          ...userData,
          role: "user",
        });

        res.status(201).json({
          message: "User created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.json(null);
        }

        res.json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // adding tickets

    app.post("/tickets", async (req, res) => {
      try {
        const ticket = req.body;

        const newTicket = {
          title: ticket.title,
          from: ticket.from,
          to: ticket.to,
          transportType: ticket.transportType,
          price: ticket.price,
          quantity: ticket.quantity,
          departureDateTime: ticket.departureDateTime,
          perks: ticket.perks, // array
          image: ticket.image,
          vendorName: ticket.vendorName,
          vendorEmail: ticket.vendorEmail,
          verificationStatus: "pending",
          createdAt: new Date(),
        };

        const result = await ticketCollection.insertOne(newTicket);

        res.status(201).json({
          message: "Ticket added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // getting my added tickets

    app.get("/tickets/vendor/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const tickets = await ticketCollection
          .find({ vendorEmail: email })
          .toArray();

        res.json(tickets);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const { ObjectId } = require("mongodb");

    // deleting tickets

    app.delete("/tickets/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await ticketCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Ticket not found" });
        }

        res.json({ message: "Ticket deleted successfully" });
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
