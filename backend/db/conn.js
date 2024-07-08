const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27018/getapet";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(mongoURL, mongooseOptions)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

module.exports = mongoose;
