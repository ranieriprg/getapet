const router = require("express").Router();

const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.get('/listar', UserController.listar)
router.post("/login", UserController.login);
router.get("/checkUser", UserController.checkUser);


module.exports = router;
