import { DataTypes, Model, Sequelize } from 'sequelize'
import type ShowName from './ShowName'
import type { Modals } from './index'

export default class Show extends Model {
    declare id: string
    declare isMovie: boolean
    declare titles: ShowName[] | string[]

    static associate(models: Modals) {
        Show.hasMany(models.ShowName, {
            onDelete: 'RESTRICT',
            foreignKey: 'show',
            as: 'titles',
        })
        models.ShowRelease.belongsTo(models.Show, {
            onDelete: 'CASCADE',
            foreignKey: 'release',
        })
    }
}

export const init = (sequelize: Sequelize) =>
    Show.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            isMovie: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'shows',
        }
    )
