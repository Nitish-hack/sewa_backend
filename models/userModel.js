const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  setid: {
    type: String,
    required: true,
    default:"0000"
  },
  chargerid: {
    type: String,
    required: true,
    default:"0000"
  },
  earphone: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
