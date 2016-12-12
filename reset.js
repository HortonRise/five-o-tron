//Load the request module
var request = require('request');
var mysql = require('mysql');
var dateFormat = require('dateformat');
const os = require('os');

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

    connection.query('UPDATE highfives SET redeemed = 0', function(err, rows, fields) {
        if (err) throw err;
		console.log("High FIves Reset");
	}
	);

  	connection.end();
    