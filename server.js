var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var request = require("request");
var bodyParser = require("body-parser");

// Sets an initial port.
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use('/', express.static(__dirname + '/public'));

app.get('/favorites', function (req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.post('/favorite', function (req, res, next) {
  if (!req.body.title) {
    res.send("Error");
  } else {
    var data = JSON.parse(fs.readFileSync('./data.json'));
    data.push(req.body);
    fs.writeFile('./data.json', JSON.stringify(data), function (err) {
      if (err) 
        throw err;
      }
    );
    res.setHeader('Content-Type', 'application/json');
    return res.send(data);
  }
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
