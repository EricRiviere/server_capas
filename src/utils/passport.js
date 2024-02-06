import jwt from "jsonwebtoken";
import passport from "passport";

const privateKey = "CoderhouseBackendCourseSecretKeyJWT";

//JSON Web Tokens JWT functinos:
export const generateJWToken = (user) => {
  return jwt.sign({ user }, privateKey, { expiresIn: "500s" });
};

export const authToken = (req, res, next) => {
  //Saving JWT in authorization headers
  const authHeader = req.headers.authorization;
  console.log("Token present in header auth:");
  console.log(authHeader);
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1];
  //Token validation
  jwt.verify(token, privateKey, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    //Token OK
    req.user = credentials.user;
    console.log("Extracting info from Token:");
    console.log(req.user);
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Calling strategy: ");
    console.log(strategy);
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      console.log("Usuer obtained by strategy: ");
      console.log(user);
      req.user = user;
      next();
    })(req, res, next);
  };
};