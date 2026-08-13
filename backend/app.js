require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// solve cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// upload directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// db connection
const db = require("./config/db.js");
// routes
const router = require("./routers/Router.js");
app.use(router);

db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to the database:", error);
  });
