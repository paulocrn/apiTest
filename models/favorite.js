module.exports = (sequelize, Sequelize) => {
  //const Product = require("./producto.js")(sequelize, Sequelize);

  const FavoriteList = sequelize.define("favoriteList", {
      userId: {
          type: Sequelize.INTEGER
      },
      items: {
          type: Sequelize.STRING
      }
  },
      { timestamps: false });

  //FavoriteList.hasMany(Product);

  return FavoriteList;
};