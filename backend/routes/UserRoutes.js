const router = require("express").Router();

//middleware
const verifyToken = require("../helpers/verify-token");
const {imageUpload} = require('../helpers/image-upload')
//models
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.get("/listar", UserController.listar);
router.post("/login", UserController.login);
router.get("/checkUser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch("/edit/:id", verifyToken, imageUpload.single('image'), UserController.editUser);

module.exports = router;
