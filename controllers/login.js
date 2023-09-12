const loginRouter = require("express").Router();
const User = require("../models/user");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const tokenExtractor = (req, res, next) => {
    req.token = null;
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        req.token = authorization.replace("Bearer ", "");
    }
    next();
};

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, "secret");
    if (!decodedToken) {
        return res.status(401).json({ error: "token invalid" });
    }
    req.user = decodedToken;
    next();
};

loginRouter.post("/", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordCorrect =
        user === null
            ? false
            : crypto.PBKDF2(password, email, {
                  keySize: 256,
                  iterations: 100,
              }) == user.passwordHash;

    if (!(user && passwordCorrect)) {
        return response.status(401).json({ error: "incorrect credentials" });
    }

    const userToken = {
        email,
        id: user._id,
    };

    const token = jwt.sign(userToken, "secret", {
        expiresIn: 3000,
    });

    res.status(200).send({ token, email: email });
});

loginRouter.post("/verify", tokenExtractor, userExtractor, async (req, res) => {
    const email = req.user.email;
    const user = await User.findOne({ email });

    const { fingerprint } = req.body;
    console.log(fingerprint);
    const fingerprintVerify =
        crypto.PBKDF2(fingerprint, email, {
            keySize: 256,
            iterations: 100,
        }) == user.fingerprintHash;

    if (!fingerprintVerify) {
        return res.status(401).json({ error: "incorrect fingerprint" });
    }

    res.status(200).send("Verified");
});

module.exports = loginRouter;
