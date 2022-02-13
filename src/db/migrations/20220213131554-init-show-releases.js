'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('shows_releases', {
          show: {
            type: Sequelize.UUID,
            primaryKey: true,
            references: {
              model: 'shows',
              key: 'id'
            }
          },
          release: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'releases',
              key: 'id'
            }
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false
          },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }

        },
        {
          indexes: [{ unique: true, fields: ['release'] }]
        });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('shows_releases');
  }
};
