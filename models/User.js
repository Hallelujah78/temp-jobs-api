const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    minLength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "please provide a valid password"],
    minLength: 6,
  },
  email: {
    type: String,
    required: [true, "please provide an email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please enter a valid email",
    ],
    unique: true,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  // 'this' points to our document (item in database?)
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.validatePassword = async function (reqPass) {
  const isMatch = await bcrypt.compare(reqPass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
