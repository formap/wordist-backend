var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  words: [{
    type: Schema.Types.ObjectId, ref: 'Word'
  }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
