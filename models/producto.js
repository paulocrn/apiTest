module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("productos", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codigo: {
            type: Sequelize.STRING
        },
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.STRING
        },
        cantidad: {
            type: Sequelize.INTEGER
        },
        cantidadCaja: {
            type: Sequelize.INTEGER
        },
        productPicture: {
            type: Sequelize.STRING
        },
        categoria: {
            type: Sequelize.STRING
        },
    },
        { timestamps: false });
    return Product;
};