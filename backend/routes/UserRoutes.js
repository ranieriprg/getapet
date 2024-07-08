const router = require("express").Router();

//middleware
const verifyToken = require("../helpers/verify-token");

//models
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.get("/listar", UserController.listar);
router.post("/login", UserController.login);
router.get("/checkUser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch("/edit/:id", verifyToken, UserController.editUser);

module.exports = router;
