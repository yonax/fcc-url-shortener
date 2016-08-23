const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;

const create_table = `
    create table if not exists url (
        id serial primary key,
        original varchar(1024)
    )
`;

pg.connect(DATABASE_URL, (err, client, done) => {
    client.query(create_table, (err, result) => {
        done();
        if (err) {
            console.error(err);
        } else {
            console.log('table created');
        }
        process.exit();
    });
});
