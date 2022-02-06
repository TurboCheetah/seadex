import Show from "../modals/Show";
import sequelize from "../sequelize";
import {QueryTypes} from "sequelize";
import Release from "../modals/Release";
import ShowName from "../modals/ShowName";

export type ReleaseWithType = Release & { type: string }
export type ShowWithTitle = { id: string, isMovie: boolean, titles: ShowName[] }
export type ReleaseList = { show: ShowWithTitle, releases: ReleaseWithType[] }[]

export const getAllReleases = async (): Promise<ReleaseList> => {
    const shows = await Show.findAll();
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
