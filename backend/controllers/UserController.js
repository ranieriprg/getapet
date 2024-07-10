//helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-token");

//models
const User = require("../models/User");

//crypt&password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    let currentUser;
    if (req.headers.authorization) {
      const token = getToken(req);
      //decodificar o token
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    let image = "";

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }
    user.email = email;

    if (req.file) {
       user.image = req.file.filename;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      return;
    }
    user.phone = phone;

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({ error: "As senhas não conferem." });

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;

      const passwordHash = await bcrypt.hash(reqPassword, salt);

      user.password = passwordHash;
    }

    try {
      // returns updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.json({
        message: "Usuário atualizado com sucesso!",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
