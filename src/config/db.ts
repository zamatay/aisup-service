const isolation = require('tedious').ISOLATION_LEVEL.READ_UNCOMMITTED;
console.log(process.env);
export const db = {
    type: 'mssql',
    host: process.env.MSSQL_HOST,
    username: process.env.MSSQL_LOGIN,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DB,
    options: {
        encrypt: false,
        enableArithAbort: true,
        isolation: isolation,
        connectionIsolationLevel: isolation,
    },
    pool: {
        max: 20
    },
    autoLoadEntities: true,
}