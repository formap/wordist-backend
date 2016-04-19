var Promise = require('bluebird');
var express_jwt = require('express-jwt');
var config = require('../config.json');
var mongoose = require('mongoose');
var User = mongoose.model('User');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
var Word = mongoose.model('Word');
Promise.promisifyAll(Word);
Promise.promisifyAll(Word.prototype);

var wordsRouter = require('express').Router({mergeParams: true});

wordsRouter.get('/', express_jwt({'secret': config.jwt_secret}), function(req, res) {
  var id = req.params.user_id;
  User.findOne({'_id': id})
  .populate('words')
  .exec()
  .then(function(user) {
    res.status(200).send(user.words);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json({'error': err.message, 'message': 'Error retrieving words'});
  });
});

wordsRouter.post('/', express_jwt({'secret': config.jwt_secret}), function(req, res) {
  var id = req.params.user_id;
  var word = req.body.word;
  var definition = req.body.definition;
  var user = null;
  User.findOne({'_id': id})
  .then(function(oldUser) {
    user = oldUser;
    var newWord = {
      word: word,
      definition: definition
    };
    var wordDb = new Word(newWord);
    return wordDb.saveAsync();
  })
  .then(function(savedWord) {
    user.words.push(savedWord._id);
    return user.saveAsync();
  })
  .then(function(savedUser) {
    return User.populate(savedUser, 'words');
  })
  .then(function(populatedUser) {
    res.status(200).send(populatedUser);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json({'error': err.message, 'message': 'Error saving new word'});
  });
});

module.exports = wordsRouter;
