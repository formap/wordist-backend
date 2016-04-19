var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var tokenAuth = require('./tokenAuth.js');
var config = require('../../config.json');
var authRouter = require('express').Router();
var User = require('mongoose').model('User');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

authRouter.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if(!email || !password) {
    res.status(400).json({'error': true, 'message': 'Incorrect parameters'});
    return;
  }

  User.findOneAsync({email: email})
  .then(function(result) {
    if (result) return res.status(400).send("Email taken");
    return bcrypt.hashAsync(password, 12);
  })
  .then(function(hash) {
    var userData = {
      email: email,
      password: hash
    };
    var userDb = new User(userData);
    return userDb.saveAsync();
  })
  .then(function(user) {
    user = user.toObject();
    delete user.password;
    res.status(200).json(user);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json({'error': err.message, 'message': 'Error creating user'});
  });
});

authRouter.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var user = null;

  User.findOneAsync({email: email})
  .then(function(result) {
    user = result.toObject();
    if(!result) return res.status(404).send('Cannot find user with that username');
    return bcrypt.compareAsync(password, user.password);
  })
  .then(function(result) {
    if(!result) return res.status(401).send("Password incorrect");
    var signed = {
      _id: user._id.toString(),
      email: user.email,
      password: user.password
    };
    var token = tokenAuth.issueToken(signed);
    delete user.password;
    res.status(200).json({user: user, token: token});
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json({'error': err.message, 'message': 'Error logging in'});
  });
});

module.exports = authRouter;
