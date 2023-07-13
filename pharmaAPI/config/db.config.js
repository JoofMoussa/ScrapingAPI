module.exports = {
    HOST: "localhost",
    USER: "defaultuser2",
    PASSWORD: "root123",
    DB: "sunuapi",
    dialect: "postgres",
    // pool est optionnel
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};