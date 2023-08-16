var {Faker, es} = require('@faker-js/faker');
'use strict';
const faker = new Faker({ locale: [es] });
module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        var dummyJSON = [];
        for (var i = 0; i < 5; i++) {
            dummyJSON.push({
                nombre: faker.person.firstName(),
                apellido: faker.person.lastName(),
                cedula: faker.string.numeric({ length: { min: 10, max: 13 } }),
                email: faker.internet.email(),
                password: faker.internet.password(),
                phone: faker.phone.number("+593#########"),
                direccion: faker.location.streetAddress(),
                profilePicture: faker.image.avatar()
            });
        }
        await queryInterface.bulkInsert('usuarios', dummyJSON, {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('usuarios', null, {});
    }
};