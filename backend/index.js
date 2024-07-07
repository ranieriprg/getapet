const express = require("express");
const cors = require("cors");
// const conn = require('./db/conn')

const app = express();

//config JSON response
app.use(express.json());

//solve cors
app.use(cors({ credentials: true, origin: "http://locahost:3000" }));

//public folder for images
app.use(express.static("public"));

//routes
const UserRoutes = require("./routes/UserRoutes");
app.use("/users", UserRoutes);

app.listen(5000);


