const isolation = require('tedious').ISOLATION_LEVEL.READ_UNCOMMITTED;
export const db = {
    type: 'mssql',
    host: '192.168.0.12',
    username: 'sa',
    password: 'ggyyndk',
    database: 'vkb_test1',
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