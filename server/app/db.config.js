module.exports = {
    // HOST: "dahlskog.fi",
    // USER: "dahlskog_fm",
    // PASSWORD: "NGi0BMK~QV)U",
    // DB: "dahlskog_fm",
    HOST: "localhost",
    USER: "swc",
    PASSWORD: "swc",
    DB: "swc_test",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: "Europe/Helsinki",
    logging: console.log
};