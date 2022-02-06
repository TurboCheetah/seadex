import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import Release from "./Release";
import Show from "./Show";


export default class ShowRelease extends Model {
    declare show: string
    declare release: string
}

ShowRelease.init(
    {
        show: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: Show,
                key: 'id'
            }
        },
        release: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Release,
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
        modelName: 'shows_release',
        indexes: [{ unique: true, fields: ['release'] }]
    }
)

