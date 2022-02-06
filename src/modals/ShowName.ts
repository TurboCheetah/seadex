import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import Show from "./Show";


export default class ShowName extends Model {
    declare id: string
    declare show: string
    declare title: string
    declare language: string
}

ShowName.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        show: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: Show,
                key: 'id'
            }
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        language: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'show_names',
        indexes: [{ unique: true, fields: ['title', 'language'] }]
    }
)
