//Load the request module
var request = require('request');
var mysql = require('mysql');
var dateFormat = require('dateformat');
const os = require('os');

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var today = new Date();
var twoWeeks = today.addDays(-14);
var fiveTS = dateFormat(twoWeeks, "yyyy-mm-dd");

connectionVars = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'highfive',
    port: 8889
}
if (os.platform() == "win32" || os.platform() == "linux") {
    delete connectionVars['port'];
}var connection = mysql.createConnection(connectionVars);

connection.connect();

    connection.query('DELETE FROM highfives', function(err, rows, fields) {
        if (err) throw err;
		console.log("High Fives Cleared");
	}
	);

connection.query("UPDATE settings SET lastSearchDate = ?", [fiveTS], function(err, result) {
                console.log("Updated Timestamp to " + fiveTS);
                    });

  	connection.end();
    