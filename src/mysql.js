const mysql = require('mysql')

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.MYSQL_HOST ? process.env.MYSQL_HOST : '127.0.0.1',
    user            : process.env.MYSQL_USER ? process.env.MYSQL_USER : 'root',
    password        : process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : 'admin*#!',
    database        : process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : 'trackers',
});

function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            err ? reject(err) : connection.query(sql, values,  ( err, rows) => { err ? reject( err ) : resolve( rows ) })
        })          
    })
} 

function getLastPastEventBlockNumber() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT MAX(blockNumber) as block FROM transfers', (err, result, fields) => {
            err ? reject(err) : resolve(result)
        })
    })
   // query('SELECT MAX(blockNumber) FROM transfers')
}

module.exports = {
    query, 
    getLastPastEventBlockNumber
}