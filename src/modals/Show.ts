import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import ShowName from "./ShowName";


export default class Show extends Model {
    declare id: string
    declare isMovie: boolean
}

Show.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        isMovie: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'shows'
    }
)
