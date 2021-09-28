var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_blackkar',
  password        : '5450',
  database        : 'cs340_blackkar'
});

module.exports.pool = pool;
