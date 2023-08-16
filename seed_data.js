var {Faker, es} = require('faker');
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
        for (var i = 0; i < 50; i++) {
            dummyJSON.push({
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
                ip: faker.internet.ip(),
                address: faker.address.streetAddress(),
                city: faker.address.cityName(),
                createdAt: new Date(),
                updatedAt: new Date()
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
        await queryInterface.bulkDelete('Users', null, {});
    }
};