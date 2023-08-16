module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("usuarios", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        cedula: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.TEXT
        },
        phone: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.TEXT
        },
        profilePicture: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        pushTokens: {
            type: Sequelize.TEXT
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
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
    return User;
};