const createUserToken = require("../helpers/create-user-token");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, phone, confirmpassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O campo nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O campo email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "O campo password é obrigatório" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O campo phone é obrigatório" });
      return;
    }
    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "O campo confirmpassword é obrigatório" });
      return;
    }
    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ message: "As senhas não conferem, tente novamente" });
      return;
    }

    //confirm if user exist
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.status(422).json({ message: "Email já existente!" });
      return;
    }

    //create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create user
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      console.log("Novo usuário criado:", newUser);
      await createUserToken(newUser, req, res);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ message: `Erro ao criar o usuário: ${error}` });
    }
  }
  static async listar(req, res) {
    console.log("chamando metodo listar");
    try {
      const user = await User.find();

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: `Erro ao listar usuários: ${error.message}` });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O campo email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "O campo password é obrigatório" });
      return;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(422)
        .json({ message: "Não há usuario cadastrado com este email" });
      return;
    }

    //check password matchs
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(422).json({ message: "Senhas não conferem! tente novamente" });
      return;
    }
    await createUserToken(user, req, res);
  }
  static async checkUser(req, res) {
    let currentUser
    console.log(req.headers.authorization);
    
    if(req.headers.authorization){

      

    } else {
      currentUser = null
    }
    res.status(200).send(currentUser)
  }
};
