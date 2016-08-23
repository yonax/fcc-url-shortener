const Pool = require('pg').Pool;
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

const pool = new Pool(config);

function query(sql, params) {
    return pool.connect().then(client =>
        client.query(sql, params).then(res => {
            client.release();
            return res;
        })
        .catch(err => {
            client.release();
            console.log(`${sql} error:`, err.message, err.stack);
        })
    )
}

function insert(original) {
    return query(
        'insert into url(original) values ($1) returning id',
        [original]
    ).then(res => res.rows[0].id);
}

function fetch(id) {
    return query(
        'select original from url where id = $1',
        [id]
    ).then(res => res.rowCount === 1 ? res.rows[0].original : void 0);
}

module.exports = {
    insert, fetch
}