module.exports = {
    // HOST: "dahlskog.fi",
    HOST: "localhost",
    // USER: "dahlskog_swc",
    // PASSWORD: "JM(xK75C*%fQ",
    // DB: "dahlskog_wp_3atnn",
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
    timezone: "Europe/Helsinki"
};