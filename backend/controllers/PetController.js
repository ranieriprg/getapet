const Pet = require("../models/Pet");

// helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, description, weight, color } = req.body;
    const image = req.file;
    const available = true;

    // console.log(req.body)
    console.log(images);
    // return

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    }

    if (!images) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

  }
};
