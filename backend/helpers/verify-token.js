const jtw = require("jsonwebtoken");
const getToken = require("./get-token");

//middleware to validade token
const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso negado" });
  }
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  try {
    const verified = jtw.verify(token, "nossosecret");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token inválido" });
  }
};

module.exports = checkToken;
