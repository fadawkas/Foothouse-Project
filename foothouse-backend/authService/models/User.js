const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
