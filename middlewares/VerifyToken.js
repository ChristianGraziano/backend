const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({
      errorType: "Token non presente",
      statuCode: 401,
      message:
        "per utilizzare l'endpoint e necessario un token di autorizzazzione!!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(403).send({
      errorType: "Token error",
      status: 403,
      message: "il token fornito non e valido o è scaduto",
    });
  }
};
