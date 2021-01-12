const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0777',
    port: 3306,
    database: 'NODE_DB',
    dateStrings: 'date'
});


function getAllMemos(callback) {
    connection.query(`SELECT * FROM board`, (err, rows, fields) => {
        if (err) throw err;
        callback(rows);     // db 관련 코드는 callback 형태로 구현해야 db 조회 후 온전히 view 데이터로 전달 가능
    });
}

function insertMemo(content, callback) {
    connection.query(`INSERT INTO board (CONTENT, CREATED_AT, UPDATED_AT) VALUES ('${content}', now(),now())`, (err, result) => {
        if (err) throw err;
        callback();
    })
}

function getMemoById(id, callback) {
    connection.query(`SELECT * FROM board WHERE ID=${id}`, (err, row, fields) => {
        if (err) throw err;
        callback(row);
    });
}

function updateMemoById(id, content, callback) {
    connection.query(`UPDATE board SET CONTENT='${content}', UPDATED_AT=NOW() WHERE ID=${id}`, (err, result) => {
        if (err) throw err;
        callback();
    });
}

function deleteMemoById(id, callback) {
    let sqlbuffer = `DELETE FROM board WHERE ID=${id}`;
    connection.query(sqlbuffer, (err, result) => {
        if (err) throw err;
        callback();
    });
}

function resetById(callback) {
    let sql1 = `alter table node_db.memos auto_increment = 1`;
    let sql2 = `set @count = 0`;
    let sql3 = `update node_db.memos set node_db.memos.ID  = @count:=@count+1`;
    connection.query(sql1, (err, result) => {
        if (err) throw err;
        connection.query(sql2, (err, result) => {
            if (err) throw err;
            connection.query(sql3, (err, result) => {
                if (err) throw err;
                callback();
            });
        });
    });
}

module.exports = {
    getAllMemos,
    insertMemo,
    getMemoById,
    updateMemoById,
    deleteMemoById,
    resetById
}