
var express = require('express');
var app = express.Router();
const mysql = require('./dbcon.js');

const getAllProductCategoryQuery = 'SELECT * FROM productCategories;';
const insertQuery = 'INSERT INTO `productCategories` (`beverageType`, `productSpec`) VALUES(?, ?);';
const updateQuery = "UPDATE `productCategories` SET `beverageType`=?, `productSpec`=? WHERE `categoryID`= ?;";
const deleteQuery = "DELETE FROM `productCategories` WHERE `categoryID`= ?;";
const dropTableQuery = "DROP TABLE IF EXISTS productCategories";
const makeTableQuery = "CREATE TABLE `productCategories` (" + 
                        "`categoryID` int(11) NOT NULL AUTO_INCREMENT," + 
                        "`beverageType` varchar(255)," + 
                        "`productSpec` varchar(255) NOT NULL," +
                        "PRIMARY KEY(`categoryID`));"

//retrieves all data from query pool
const getAllProductCategoryData = (res) => {
    context = {};
    mysql.pool.query(getAllProductCategoryQuery, (err, rows, fields) => {
        if(err){
            next(err);
            return;
        }

        res.json({rows: rows});
    });
};

app.get('/',function(req,res,next){
    getAllProductCategoryData(res);
    });

app.post('/', function(req, res, next){
    let {beverageType, productSpec} = req.body;
    console.log("post worked");
    
    mysql.pool.query(
        {sql: insertQuery, 
        values: [beverageType, productSpec]}, 
        (err, result) => {
        if(err){
        next(err);
        return;
        }
    
        getAllProductCategoryData(res);
    
        }
    );
});

// delete
app.delete('/',function(req,res,next){
    console.log("delete worked");
    mysql.pool.query(
      {sql: deleteQuery, 
      values: [req.body.categoryID]}, 
      (err, result) => {
      if(err){
        next(err);
        return;
      }
      getAllProductCategoryData(res);
    });
  });

//safe-update
app.put('/',function(req,res,next){
    console.log("update worked");
    var {categoryID, beverageType, productSpec} = req.body;
    mysql.pool.query(
      {sql: updateQuery, 
      values: [beverageType, productSpec, categoryID]},
      (err, result) => {
        if(err){
          next(err);
          return;
        };
        getAllProductCategoryData(res);
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
        getAllProductCategoryData(res);
    })
    });
});

module.exports = app;
