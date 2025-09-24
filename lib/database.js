

const sql = require('mssql');

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let poolPromise;

const getConnection = async () => {
    try {
        if (!poolPromise) {
            console.log('Connecting to database with user:', process.env.DB_USER);
            poolPromise = new sql.ConnectionPool(config).connect();
        }
        return await poolPromise;
    } catch (error) {
        console.error('Database connection failed:', {
            message: error.message,
            code: error.code,
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER
        });
        throw error;
    }
};

const closeConnection = async () => {
    try {
        if (poolPromise) {
            const pool = await poolPromise;
            await pool.close();
            poolPromise = null;
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};

module.exports = {
    getConnection,
    closeConnection,
    sql
};
