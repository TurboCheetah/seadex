import {Show, Release, ShowName} from "../modals";
import {sequelize} from "../db";
import {QueryTypes} from "sequelize";

// @ts-ignore
export type ReleaseWithType = Release & { type: string }
export type ShowWithTitle = {
    id: string,
    isMovie: boolean,
    // @ts-ignore
    titles: ShowName[]
}
export type ReleaseList = { show: ShowWithTitle, releases: ReleaseWithType[] }[]

export const getAllReleases = async (): Promise<ReleaseList> => {
    const shows = await Show.findAll({attributes: ['id', 'isMovie']});
    return await Promise.all(shows.map(async show => {
        const titles = await ShowName.findAll({
            where: {
                show: show.id
            }
        });

        const rows = await sequelize.query(`
            SELECT releases.*, type
            FROM shows_releases
                     LEFT JOIN releases ON shows_releases.release = releases.id
            where show = ?;
        `, {
            replacements: [show.id],
            type: QueryTypes.SELECT,
        });
        // const rows = await ShowRelease.findAll({where: {show: show.id}, include: Release, attributes: ['release.*', 'type']})
        return {
            show: {
                id: show.id,
                isMovie: show.isMovie,
                titles
            },
            releases: rows as ReleaseWithType[]
        }
    }))
}
