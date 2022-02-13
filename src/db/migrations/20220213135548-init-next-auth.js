'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('accounts', {
            id: {
                type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true,
            },
            type: {type: Sequelize.STRING, allowNull: false},
            provider: {type: Sequelize.STRING, allowNull: false},
            provider_account_id: {type: Sequelize.STRING, allowNull: false},
            refresh_token: {type: Sequelize.STRING},
            access_token: {type: Sequelize.STRING},
            expires_at: {type: Sequelize.INTEGER},
            token_type: {type: Sequelize.STRING},
            scope: {type: Sequelize.STRING},
            id_token: {type: Sequelize.STRING},
            session_state: {type: Sequelize.STRING},
            user_id: {type: Sequelize.UUID},
        });
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID, primaryKey: true,
            }, name: {
                type: Sequelize.STRING,
            }, email: {
                type: Sequelize.STRING, unique: true,
            }, image: {
                type: Sequelize.STRING,
            },
            emailVerified: { type: Sequelize.DATE },
            isEditor: {
                type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
        await queryInterface.createTable('sessions', {
            id: {
                type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true,
            },
            expires: {type: Sequelize.DATE, allowNull: false},
            session_token: {type: Sequelize.STRING, unique: 'session_token', allowNull: false},
            user_id: {type: Sequelize.UUID},
        });

        await queryInterface.createTable('verification_tokens', {
            token: {type: Sequelize.STRING, primaryKey: true},
            identifier: {type: Sequelize.STRING, allowNull: false},
            expires: {type: Sequelize.DATE, allowNull: false},
        });


    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('accounts');
        await queryInterface.dropTable('users');
        await queryInterface.dropTable('sessions');
        await queryInterface.dropTable('verification_tokens');
    }
};
