var jwt = require('jsonwebtoken');

module.exports = {
  issueToken: function (payload) {
    var token = jwt.sign(payload, process.env.SECRET);
    return token;
  },

  verifyToken: function (token, verified) {
    return jwt.verify(token, process.env.SECRET, {}, verified);
  }
};
