module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("cart", {
      userId: {
          type: Sequelize.INTEGER
      },
      items: {
          type: Sequelize.STRING
      }
  },
      { timestamps: false });

  return Cart;
};