const passportLocalMongoose = require(`passport-local-mongoose`);
const mongoose = require(`mongoose`);
const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
