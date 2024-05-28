const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', UserSchema);
