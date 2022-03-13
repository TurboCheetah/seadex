/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shows', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            isMovie: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('shows')
    },
}
