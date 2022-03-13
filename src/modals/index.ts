import { init as initRelease } from './Release'
import { init as initShow } from './Show'
import { init as initShowName } from './ShowName'
import { init as initShowRelease } from './ShowRelease'
import { sequelize } from '../db'

export const Release = initRelease(sequelize)
export const Show = initShow(sequelize)
export const ShowName = initShowName(sequelize)
export const ShowRelease = initShowRelease(sequelize)

export type Modals = {
    ShowRelease: typeof ShowRelease
    Show: typeof Show
    ShowName: typeof ShowName
    Release: typeof Release
}

const modals = { Release, Show, ShowName, ShowRelease }

Object.values(modals).forEach((it) => {
    it.associate(modals)
})
