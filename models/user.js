const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: String,
    fingerprintHash: String,
});

// userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
        delete returnedObject.fingerprintHash;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
