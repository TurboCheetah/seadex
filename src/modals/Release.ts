import { DataTypes, Model, Sequelize } from 'sequelize'
import type { Modals } from './index'

export default class Release extends Model {
    declare id: string
    declare title: string
    declare releaseGroup: string
    declare notes?: string
    declare comparisons?: string
    declare dualAudio: boolean
    declare nyaaLink?: string
    declare bbtLink?: string
    declare toshLink?: string
    declare isRelease: boolean
    declare isBestVideo: boolean
    declare incomplete: boolean
    declare isExclusiveRelease: boolean
    declare isBroken: boolean

    static associate(models: Modals) {
        // models.ShowRelease.belongsTo(models.Release, {
        //     onDelete: 'CASCADE',
        //     foreignKey: 'release'
        // })
        models.Release.hasMany(models.ShowRelease, {
            foreignKey: 'release',
        })
    }
}

export const init = (sequelize: Sequelize) =>
    Release.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            releaseGroup: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            comparisons: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            dualAudio: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            nyaaLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            bbtLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            toshLink: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isRelease: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            isBestVideo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            incomplete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isExclusiveRelease: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isBroken: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'releases',
        }
    )
