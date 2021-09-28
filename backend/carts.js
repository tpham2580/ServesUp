
var express = require('express');
var app = express.Router();
const mysql = require('./dbcon.js');

const getAllQuery = 'SELECT cartID, totalCost, if (`status`,"Yes", "No") as `status` FROM `carts`;';
const insertQuery = 'INSERT INTO `carts` (`totalCost`, `status`) VALUES(?, ?);';
const updateQuery = "UPDATE `carts` SET totalCost=?, status=? WHERE `cartID`= ?";
const deleteQuery = "DELETE FROM `carts` WHERE `cartID`= ?";
const dropTableQuery = "DROP TABLE IF EXISTS carts";
const makeTableQuery = "CREATE TABLE `carts` (" + 
                        "`cartID` int(11) NOT NULL AUTO_INCREMENT," + 
                        "`totalCost` decimal(6,2) NOT NULL," + 
                        "`status` BOOLEAN NOT NULL," +
                        "PRIMARY KEY(`cartID`));"

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
    let {totalCost, status} = req.body;
    console.log(req.body);
    
    mysql.pool.query(
        {sql: insertQuery, 
        values: [totalCost, status]}, 
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
    values: [req.body.cartID]}, 
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
    var {totalCost, status, cartID} = req.body;
    mysql.pool.query(
      {sql: updateQuery, 
      values: [totalCost, status, cartID]},
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
