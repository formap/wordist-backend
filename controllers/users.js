var Promise = require('bluebird');
var express_jwt = require('express-jwt');
var wordsRouter = require('./words.js');
var tokenAuth = require('./tokenAuth.js');
var User = require('mongoose').model('User');

var usersRouter = require('express').Router();

usersRouter.use('/:user_id', function(req, res, next) {
  var id = req.params.user_id;
  var reqToken = req.headers['authorization'];
  var credentials = reqToken.split(" ").pop();
  tokenAuth.verifyToken(credentials, function(err, token) {
    if (token._id == id) {
      next();
    } else {
      res.status(401).json({'Error': true, 'Message': 'Unauthorized'});
    }
  });
});

usersRouter.use('/:user_id/words', wordsRouter);

module.exports = usersRouter;
