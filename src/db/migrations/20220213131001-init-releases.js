/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('releases', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            title: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            releaseGroup: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            comparisons: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            dualAudio: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            nyaaLink: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            bbtLink: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            toshLink: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            isRelease: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            isBestVideo: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            incomplete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isExclusiveRelease: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isBroken: {
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
        await queryInterface.dropTable('releases')
    },
}
