const mysql = require('mysql')
module.exports = {
    config: {
        // database config
        connnectionLimit: 10,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '0309miku0831',
        database: 'labelhelper',
    },

    // connect to database
    // connecting pool
    sqlConnect: function(sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            //console.log('in sqlConnection pool...');
            if (err) {
                console.log(err);
                return;
            }
            // calback 
            conn.query(sql, sqlArr, callBack);
            // release connection
            conn.release();
        })
    }
}