const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:123@127.0.0.1:5438/projecttracker',
});

console.log('Connecting to DB...');
client.connect()
    .then(() => {
        console.log('Connected successfully!');
        return client.end();
    })
    .catch(err => {
        console.error('Connection failed!', err);
    });
