var express = require('express');
var app = express.Router();
const mysql = require('./dbcon.js');

const getAllQuery = 'SELECT * FROM payments;';
const insertQuery = 'INSERT INTO `payments` (`cartID`, `date`, `tipAmount`, `totalAmount`, `paymentType`) VALUES((SELECT `cartID` FROM `carts` WHERE `cartID` = ?), ?, ?, ?, ?);';
const updateQuery = "UPDATE `payments` SET `cartID`=(SELECT `cartID` FROM `carts` WHERE `cartID` = ?), `date`=?, `tipAmount`=?, `totalAmount`=?, `paymentType`=? WHERE `paymentID`= ?";
const deleteQuery = "DELETE FROM `payments` WHERE `paymentID`= ?";
const dropTableQuery = "DROP TABLE IF EXISTS payments";
const makeTableQuery = "CREATE TABLE `payments` (" + 
                        "`paymentID` int(11) NOT NULL AUTO_INCREMENT" + 
                        "`cartID` int(11)," + 
                        "`date` DATETIME DEFAULT CURRENT_TIMESTAMP," +
                        "`tipAmount` decimal(6,2)," +
                        "`totalAmount` decimal(6,2) NOT NULL," +
                        "`paymentType` varchar(255) NOT NULL," +
                        "PRIMARY KEY (`paymentID`)," +
                        "CONSTRAINT `payments_fk1` FOREIGN KEY (`cartID`) REFERENCES `carts`(`cartID`) ON DELETE SET NULL);"

//retrieves all data from query pool
const getAllData = (res) => {
    context = {};
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }

        res.json({rows: rows});
    });
};

app.get('/',function(req,res,next){
    getAllData(res);
    });

app.post('/', function(req, res, next){
    let {cartID, date, tipAmount, totalAmount, paymentType} = req.body;
    console.log("post worked");
    
    mysql.pool.query(
        {sql: insertQuery, 
        values: [cartID, date, tipAmount, totalAmount, paymentType]}, 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
        getAllData(res);
        }
    );
});

// delete
app.delete('/',function(req,res,next){
    console.log("delete worked");
    mysql.pool.query(
      {sql: deleteQuery, 
      values: [req.body.paymentID]}, 
      (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllData(res);
    });
  });

//safe-update
app.put('/',function(req,res,next){
    console.log("update worked");
    var {paymentID, cartID, date, tipAmount, totalAmount, paymentType} = req.body;
    mysql.pool.query(
      {sql: updateQuery, 
      values: [cartID, date, tipAmount, totalAmount, paymentType, paymentID]},
      (err, result) => {
        if(err){
          next(err);
          return;
        };
        getAllData(res);
      });
  });

//reset table
app.get('/reset-table',function(req,res,next){
    console.log("Table was reset");
    mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
        if(err){
        next(err);
        return;
        };
        getAllData(res);
    })
    });
});

module.exports = app;