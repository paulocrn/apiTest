module.exports = (sequelize, Sequelize) => {
    const Orden = sequelize.define("orden", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER
        },
        items: {
            type: Sequelize.TEXT
        },
        nombre: {
            type: Sequelize.STRING
        },
        totalAmount: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        paymentMethod: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            default: "waiting", //waiting, confirmed, deliver, success
        },
        createdAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        },
        updatedAt: {
            type: "TIMESTAMP",
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
        }
    },
        { timestamps: false });
    return Orden;
};