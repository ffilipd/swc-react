module.exports = {
    // HOST: "dahlskog.fi",
    // USER: "dahlskog_fleetmanager",
    // PASSWORD: "tKTz~0CycTTM",
    // DB: "dahlskog_fleetmanager",
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