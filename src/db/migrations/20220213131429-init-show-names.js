/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'show_names',
            {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                },
                show: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    references: {
                        model: 'shows',
                        key: 'id',
                    },
                },
                title: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                language: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            },
            {
                indexes: [{ unique: true, fields: ['title', 'language'] }],
            }
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('show_names')
    },
}
