import {DataTypes, Model, Sequelize} from "sequelize";

export default class ShowRelease extends Model {
    declare show: string
    declare release: string

    static associate(models: any) {
        // models.ShowRelease.belongsTo(models.Release, {
        //     onDelete: 'RESTRICT',
        //     foreignKey: 'release'
        // })
    }

}

export const init = (sequelize: Sequelize) =>
    ShowRelease.init(
        {
            show: {
                type: DataTypes.UUID,
                primaryKey: true,
                references: {
                    model: 'shows',
                    key: 'id'
                }
            },
            release: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'releases',
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'shows_releases',
            indexes: [{unique: true, fields: ['release']}]
        }
    )

