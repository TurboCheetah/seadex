import {DataTypes, Model, Sequelize} from "sequelize";

export default class ShowName extends Model {
    declare id: string
    declare show: string
    declare title: string
    declare language: string

    static associate(models: any) {
        ShowName.belongsTo(models.Show, {
            onDelete: 'CASCADE',
            foreignKey: 'show',
            as: 'titles'
        })
    }
}

export const init = (sequelize: Sequelize) =>
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
                    'model': 'shows',
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
            indexes: [{unique: true, fields: ['title', 'language']}]
        }
    )

