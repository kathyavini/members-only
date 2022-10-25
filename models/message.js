const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  posted: Date,
});

module.exports = mongoose.model('Message', MessageSchema);
