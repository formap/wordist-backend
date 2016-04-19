var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var models = require('./models/index.js');
var config = require('./config.json');

var app = express();
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect(config.db.path);
models.initialize();
app.use(bodyParser.json());
app.use(cors());

var authRouter = require('./controllers/auth.js');
app.use('/auth', authRouter);

var usersRouter = require('./controllers/users.js');
app.use('/users', usersRouter);

http.createServer(app).listen(port, function() {
  console.log('Connection done! Listening on port ' + port);
});
