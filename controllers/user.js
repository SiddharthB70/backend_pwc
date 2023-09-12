const userRouter = require("express").Router();
const User = require("../models/user");
const crypto = require("crypto-js");

userRouter.post("/", async (req, res) => {
    const { email, password, fingerprint } = req.body;
    console.log(email, password);
    const passwordHash = crypto
        .PBKDF2(password, email, {
            keySize: 256,
            iterations: 100,
        })
        .toString();
    const fingerprintHash = crypto
        .PBKDF2(fingerprint, email, {
            keySize: 256,
            iterations: 100,
        })
        .toString();

    const newUser = new User({ email, passwordHash, fingerprintHash });
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
});
module.exports = userRouter;
