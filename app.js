var express = require('express');
var mysql = require('mysql');
var exec = require('child_process').exec;
var child;

var app = express();
app.use(express.static('public'));


var highfives = function(res) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'highfive'
  });

  connection.connect();

  var querystring = "SELECT highfives.text, highfives.redeemed, highfives.qty, DATE_FORMAT(highfives.creation_ts, '%W, %M %e %l%p') as 'date', users.first_name, users.last_name FROM highfives ";
      querystring += "LEFT JOIN users ON highfives.creator_id = users.id ";
      querystring += "ORDER BY creation_ts DESC LIMIT 50 ";

  connection.query(querystring, function(err, results, fields) {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.json ( (results) );
    console.log("Sent newest high fives!");
  });

  connection.end();

}

///////////////////// ROUTINGS //////////////

app.get('/', function (req, res) {
  //res.send('Hello world!');
});

app.get('/highfives', function(req, res) {

  highfives(res);
} );

app.listen(3000, function () {
  console.log('15Five App running on port 3000!');
});

//////////////////// UPDATE HIGH FIVES //////////////

setInterval(function(){

  child = exec('node download.js {{args}}',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });

}, 60 * 10 * 1000);
