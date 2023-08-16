module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("ventas", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_cliente: {
            type: Sequelize.STRING
        },
        detalle: {
            type: Sequelize.TEXT
        },
        cant_total_productos: {
            type: Sequelize.INTEGER
        },
        iva: {
            type: Sequelize.STRING
        },
        total: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        updatedAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal(
                "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
            ),
            allowNull: false,
        }
    },
        { timestamps: false });
    return Venta;
};