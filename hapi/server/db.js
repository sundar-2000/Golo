const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "ecom-sundar",
    port: 5432,
    password: "*****",
    database: "ecom-sundar"
});

client.connect();

async function executeQuery(query) {

    return new Promise((resolve, reject) => {

        client.query(query, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(data);
        });
        client.end;

    })
}

module.exports = { executeQuery };