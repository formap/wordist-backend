var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var express_jwt = require('express-jwt');
var wordsRouter = require('./words.js');
var tokenAuth = require('./tokenAuth.js');
var User = require('mongoose').model('User');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

var usersRouter = require('express').Router();

usersRouter.use('/:user_id', function(req, res, next) {
  var id = req.params.user_id;
  var reqToken = req.headers['authorization'];
  var credentials = reqToken.split(" ").pop();
  tokenAuth.verifyToken(credentials, function(err, token) {
    if (token._id == id) {
      next();
    } else {
      res.status(401).json({'error': true, 'message': 'Unauthorized'});
    }
  });
});

usersRouter.use('/:user_id/words', wordsRouter);

usersRouter.put('/:user_id', express_jwt({'secret': process.env.SECRET}), function(req, res) {
  var id = req.params.user_id;
  var oldPassword = req.body.oldPassword;
  var password = req.body.password;
  var user = null;
  User.findOneAsync({'_id': id})
  .then(function(oldUser) {
    if (!oldUser) return res.status(404).send({'error': true, 'message': 'Cannot find user with that username'});
    user = oldUser.toObject();
    return bcrypt.compareAsync(oldPassword, user.password);
  })
  .then(function(result) {
    if (!result) return res.status(401).send({'error': true, 'message': 'Unauthorized'});
    user.password = password;
    return user.saveAsync();
  })
  .then(function(newUser) {
    res.status(200).send({'error': false, 'message': 'Successfully updated user info'});
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json(err);
  });
})

module.exports = usersRouter;
