const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  skills: { type: String },
  experience: { type: Number },
  location: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;