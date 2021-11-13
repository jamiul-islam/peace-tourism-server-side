const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wohac.mongodb.net/cluster0?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect((err) => {
      const serviceCollection = client
        .db(process.env.DB_NAME)
        .collection("services");
      const orderCollection = client
        .db(process.env.DB_NAME)
        .collection("orders");
      const reviewCollection = client
        .db(process.env.DB_NAME)
        .collection("reviews");

      // sending data to mongodb
      // -------------------------POST Method
      app.post("/addplan", async (req, res) => {
        const data = req.body;
        const plan = { data };
        // console.log(plan); //will show in cmd
        const result = await serviceCollection.insertOne(plan);
        // console.log(result);
        res.json(result); //res.send is for mongodb. it will show in client-side's console.log()
      });

      // -------------------------GET Method
      app.get("/services", async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      });

      // -------------------------GET Method
      app.get("/orders", async (req, res) => {
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
        // localhost:5000/orders will show all the data
      });

      // -------------------------POST Method
      app.post("/orders", async (req, res) => {
        const orderData = req.body;
        console.log(orderData);
        const result = await orderCollection.insertOne(orderData);
        res.json(result);
        // checking if the data is in mongodb
        // localhost:5000/orders will show all the data
      });

      // -------------------------DELETE Method
      app.delete("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: id };
        // console.log(query);
        const result = await orderCollection.deleteOne(query);
        res.send(result);
      });

      // -------------------------GET Method
      app.get("/reviews", (req, res) => {
        reviewCollection.find({}).toArray((error, document) => {
          res.send(document);
        });
      });

      // client.close();
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// ---------------------------heroku server check
app.get("/hello", (req, res) => {
  res.send("server is working!");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(process.env.PORT || port, () => {
  console.log(`server is running at ${port}`);
});
