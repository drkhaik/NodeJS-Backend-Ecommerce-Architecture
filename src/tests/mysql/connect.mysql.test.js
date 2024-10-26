const mysql = require('mysql2');

// create connection to pool server
const pool = mysql.createPool({
    // connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'drkhaik',
    database: 'NodeJsArchitechtureDB'
});

const batchSize = 10000;
const totalSize = 1_000_000;

let currentId = 1;
console.time('::::::::::::: TIMER :::::::::');
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        values.push([currentId, name, age]);
        currentId++;
    }

    if(!values.length){
        console.timeEnd('::::::::::::: TIMER :::::::::');
        pool.end(err => {
            if(err){
                console.log(`Error occurred while running batch`);
            }else{
                console.log(`Connection pool close successfully`);
            }
        })
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age) VALUES ?`;
    pool.query(sql, [values], async function (err, results) {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} records!`);
        await insertBatch();
    })
}

insertBatch().catch(console.error)

// perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', function (err, results) {
// pool.query('SELECT * from users', function (err, results) {
//     if (err) throw err;

//     console.log('query result:', results);
//     // close pool connection
//     pool.end(err => {
//         if (err) throw err;
//         console.log('connection closed');
//     });
// });