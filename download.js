//Load the request module
var request = require('request');
var mysql = require('mysql');
var dateFormat = require('dateformat');
const os = require('os');
var now = new Date();
var repeat = 0;
var exec = require('child_process').exec;
var child;

var lastSearchDate;
var dformat;
var fiveTS;
var newCount = 0;

connectionVars = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'highfive',
    port: 8889
}
if (os.platform() == "win32" || os.platform() == "linux") {
    delete connectionVars['port'];
}


Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

//Pull the most recent date from the database
var connection = mysql.createConnection(connectionVars);


    repeat = 0;
    connection.connect();

    connection.query('SELECT lastSearchDate, DATE_FORMAT(lastSearchDate, "%Y-%m-%d") as dformat FROM settings LIMIT 1', function(err, rows, fields) {
        if (err) throw err;
        lastSearchDate = rows[0].lastSearchDate;
        dformat = rows[0].dformat;
        lastDate = new Date(lastSearchDate);

        if (dformat == '0000-00-00') {
            dformat = now;
        }

        console.log(dformat);

        //Lets configure and request
        request({
            url: 'https://riseinteractive.15five.com/api/public/high-five/?created_on_start=' + dformat, //URL to hit
            //qs: {: }, //Query string data
            method: 'GET', //Specify the method
            headers: { //We can define headers too
                'Content-Type': 'application/json',
                'Authorization': 'f9b4e9acb4834fd2b8e5a4336b706c57'
            }
        }, function(error, response, body) {
            if (error) {
                console.log(error);
            } else {
                var results = JSON.parse(body).results;
                for (var row in results) {
                    var fiveText = " " + results[row].text;
                    var fiveCreator = results[row].creator_id;
                    fiveTS = results[row].create_ts;
                    var fiveID = results[row].id;
                    var newDate = new Date(fiveTS);
                    var fiveCount = fiveText.split("@").length - 1;
                    //var filterText = fiveText.replace(/(^|\s)@(\w*[a-zA-Z_]+\w*)/, '$1<span>@$2</span>');
                    var filterText = fiveText.replace(/@(\S*)/g, '<span>@$1</span>');
                    //console.log(filterText);
                    if (newDate > lastDate) {
                        //Insert into database
                        connection.query("INSERT INTO highfives (id, creator_id, text, creation_ts, redeemed, qty) VALUES (?, ?, ?, ?, ?, ?)", [fiveID, fiveCreator, filterText, fiveTS, 0, fiveCount], function(err, result) {
                            	if (err) {
					console.log(err);
					console.log(result);
				}
				//console.log("Added new row: " + filterText);
                        });
                        newCount++;
                    } else {
                        connection.query("UPDATE highfives SET text = ? WHERE id = ?", [filterText, fiveID], function(err, result) {
                            //console.log("updated row");
                        });
                    }
                }
                //Update last search date TimeStamp
                if (dateFormat(fiveTS, "d") != dateFormat(now, "d")) {
                    repeat = 1;
                    if (newCount > 0) {
                        console.log("Date needs to be updated to next day...");
                        newDate = newDate.addDays(1);
                        fiveTS = dateFormat(newDate, "yyyy-mm-dd");
                    }
                }
                if (newCount > 0) {
                    connection.query("UPDATE settings SET lastSearchDate = ?", [newDate], function(err, result) {
                        console.log("Ran 15Five API. Added " + newCount + " new rows. Updated Timestamp to " + fiveTS);
                    });
                }
                if (repeat) {
		        //return 1;
		}
		connection.end();
		
            }
        });

    });
    