const sql = required('mssql');

const config = {
    user: 'sa',
    password: 'h@123456',
    server: 'localhost',
    database: 'A80',
    port: 1433,
    options: {
        encrypt: false, // Use true if using Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

async function getConnection(){
    try {
        const pool = await sql.connect(config);
        return pool;
    }   catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = {
    getConnection,
    sql
};