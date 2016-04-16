var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wordSchema = new Schema({
  word: {type: String, required: true},
  definition: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;
