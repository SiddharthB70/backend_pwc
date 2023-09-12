const express = require("express");
const app = express();
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://fullstackopendyz:hNS7QYpFT1dpWk4W@cluster0.qs94riw.mongodb.net/secureApp?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Database connected");
    })
    .catch(() => {
        console.log("Unable to Connect");
    });

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);

module.exports = app;
