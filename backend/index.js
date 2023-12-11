const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mainRouter = require("./routes/main.route");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/completions", mainRouter);

app.listen(3000, () => console.log("listening on port 3000"));
