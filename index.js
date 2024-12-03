require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db.connection");
const { allRoutes } = require("./global/allRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "Server health is good" });
});

app.use("/api", allRoutes);

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
  await connection;
  console.log("db connected");
});
