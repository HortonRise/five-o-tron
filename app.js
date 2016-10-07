var express = require('express');
var mysql = require('mysql');
var exec = require('child_process').exec;
var child;
const os = require('os');
var hasGPIO = false;
if (os.platform()  == "linux") {
	hasGPIO = true;
	var Gpio = require('pigpio').Gpio,
	  motor = new Gpio(23, {mode: Gpio.OUTPUT}),
	  pulseWidth = 500,
	  increment = 100;
}

var app = express();
app.use(express.static('public'));

child = exec('node download.js {{args}}',

  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});


var highfives = function(res) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'highfive'
  });

  connection.connect();

  var querystring = "SELECT highfives.id, highfives.text, highfives.redeemed, highfives.qty, DATE_FORMAT(highfives.creation_ts, '%W, %M %e %l%p') as 'date', users.first_name, users.last_name FROM highfives ";
      querystring += "LEFT JOIN users ON highfives.creator_id = users.id ";
      querystring += "ORDER BY creation_ts DESC LIMIT 200 ";

  connection.query(querystring, function(err, results, fields) {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    res.json ( (results) );
    console.log("Sent newest high fives!");
  });

  connection.end();

}

var redeem = function(id) {
	var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'highfive'
  });

  connection.connect();

  var querystring = "UPDATE highfives SET redeemed = 1 WHERE id = " + id;

  connection.query(querystring, function(err, results, fields) {
    if (err) throw err;
    console.log("Redeemed #" + id + "!");
  });

  connection.end();
}


///////////////////// ROUTINGS //////////////

app.get('/highfives', function(req, res) {
  highfives(res);
} );

app.get('/redeem', function(req, res) {
	if (hasGPIO) {
		motor.servoWrite(1200);
		setTimeout(function () {
	  		motor.servoWrite(2000);
		}, 500);
	}
	var fiveID = req.param('fiveID');
	redeem(fiveID);
	res.send('High five #' + fiveID);
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
