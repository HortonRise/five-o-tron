//Load the request module
var request = require('request');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var now = new Date();
<<<<<<< HEAD
var repeat = 0;
=======
>>>>>>> refs/remotes/origin/master


var lastSearchDate;
var dformat;
var fiveTS;
var newCount = 0;

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

//Pull the most recent date from the database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'highfive'
});

connection.connect();

connection.query('SELECT lastSearchDate, DATE_FORMAT(lastSearchDate, "%Y-%m-%d") as dformat FROM settings LIMIT 1', function(err, rows, fields) {
  if (err) throw err;
  lastSearchDate =  rows[0].lastSearchDate;
  dformat =  rows[0].dformat;
  lastDate = new Date(lastSearchDate);


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
  }, function(error, response, body){
      if(error) {
          console.log(error);
      } else {
          var results = JSON.parse(body).results;
          for(var row in results){
            var fiveText = " " + results[row].text;
            var fiveCreator = results[row].creator_id;
            fiveTS      = results[row].create_ts;
            var fiveID      = results[row].id;
            var newDate = new Date(fiveTS);
            var fiveCount = fiveText.split("@").length - 1;
            //var filterText = fiveText.replace(/(^|\s)@(\w*[a-zA-Z_]+\w*)/, '$1<span>@$2</span>');
            var filterText = fiveText.replace(/@(\S*)/g,'<span>@$1</span>');
            //console.log(filterText);
            if (newDate > lastDate) {
              //Insert into database
              connection.query("INSERT INTO highfives (id, creator_id, text, creation_ts, redeemed, qty) VALUES (?, ?, ?, ?, ?, ?)", [fiveID, fiveCreator, filterText, fiveTS, 0, fiveCount], function(err, result) {
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
          if ( dateFormat(fiveTS, "d") != dateFormat(now, "d") ) {
<<<<<<< HEAD
		repeat = 1;
            	console.log("Date needs to be updated to next day...");
            	newDate = newDate.addDays(1);
            	fiveTS = dateFormat(newDate, "yyyy-mm-dd") ;
=======
            console.log("Date needs to be updated to next day...");
            newDate = newDate.addDays(1);
            fiveTS = dateFormat(newDate, "yyyy-mm-dd") ;
>>>>>>> refs/remotes/origin/master
          }
          connection.query("UPDATE settings SET lastSearchDate = ?", [fiveTS], function(err, result) {
              console.log("Ran 15Five API. Added " + newCount +" new rows. Updated Timestamp to " + fiveTS);
          });
	  connection.end();
	  if (false) {
		child = exec('node download.js {{args}}',
		    function (error, stdout, stderr) {
		      console.log('stdout: ' + stdout);
		      console.log('stderr: ' + stderr);
		      if (error !== null) {
		        console.log('exec error: ' + error);
		      }
 		 });
	  }
          
      }
  });

});