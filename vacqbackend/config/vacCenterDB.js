const mysql = require("mysql2");

var connecton = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Smart35963',
    database: 'vacCenter'
});

module.exports = connecton;