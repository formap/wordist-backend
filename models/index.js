var models = ['./users.model.js', './words.model.js'];

exports.initialize = function() {
  models.forEach(function(model) {
    require(model)();
  });
};
