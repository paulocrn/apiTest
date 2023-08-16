var {Faker, es} = require('@faker-js/faker');
'use strict';
const faker = new Faker({ locale: [es] });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        var dummyJSON = [];
        for (var i = 0; i < 5; i++) {
            dummyJSON.push({                
                codigo: faker.string.alphanumeric(5),
                nombre: faker.commerce.product(),
                descripcion: faker.commerce.productName(),
                precio: faker.commerce.price(),
                cantidad: faker.number.int({ min: 0, max: 1000 }),
                cantidadCaja: 24,
                productPicture: faker.image.urlLoremFlickr({ category: "liquor+bottles" })
            });
        }
        await queryInterface.bulkInsert('productos', dummyJSON, {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('productos', null, {});
    }
};