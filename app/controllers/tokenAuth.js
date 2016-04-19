var jwt = require('jsonwebtoken');
var config = require('../../config.json');

module.exports = {
  issueToken: function (payload) {
    var token = jwt.sign(payload, config.jwt_secret);
    return token;
  },

  verifyToken: function (token, verified) {
    return jwt.verify(token, config.jwt_secret, {}, verified);
  }
};
