import {DataTypes, Model, Sequelize} from "sequelize";

export default class Show extends Model {
    declare id: string
    declare isMovie: boolean

    static associate(models: any) {
        models.ShowName.belongsTo(models.Show, {
            onDelete: 'CASCADE',
            foreignKey: 'show'
        })
        models.ShowRelease.belongsTo(models.Show, {
            onDelete: 'CASCADE',
            foreignKey: 'release'
        })
    }
}

export const init = (sequelize: Sequelize) =>
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
