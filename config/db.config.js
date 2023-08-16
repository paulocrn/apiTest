module.exports = {
    //HOST: "localhost",
    HOST: "116.202.116.61",
    //USER: "root",
    USER: "tecnialu_root",
    //PASSWORD: "1234",
    PASSWORD: "tecni1234??",
    //DB: "testdb",
    DB: "tecnialu_apiTest",
    dialect: "mysql", 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};