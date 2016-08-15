
var exports = module.exports = {};


exports.highfives = function(x) {
  mysql = x;
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
    return( results  );
  });

  connection.end();

}

exports.lowfives = function() {
  return "hey!";
}
