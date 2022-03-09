import {Show, ShowName} from "../modals";
import type ReleaseType from "../modals/Release";
import type ShowNameType from "../modals/ShowName";
import {sequelize} from "../db";
import {QueryTypes} from "sequelize";

export type ReleaseWithType = ReleaseType & { type: string }
export type ShowWithTitle = {
    id: string,
    isMovie: boolean,
    titles: ShowNameType[]
}
export type ShowRelease = { show: ShowWithTitle, releases: ReleaseWithType[] }
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

export const getShowsReleases = async (showId: string, title?: string): Promise<ReleaseWithType[]> => {
    // raw SQL > ORM for complex queries -- I can't get sequelize to work with this query
    const sql = `
SELECT "shows_releases"."type",
       "release"."id"                 AS "id",
       "release"."title"              AS "title",
       "release"."releaseGroup"       AS "releaseGroup",
       "release"."notes"              AS "notes",
       "release"."comparisons"        AS "comparisons",
       "release"."dualAudio"          AS "dualAudio",
       "release"."nyaaLink"           AS "nyaaLink",
       "release"."bbtLink"            AS "bbtLink",
       "release"."toshLink"           AS "toshLink",
       "release"."isRelease"          AS "isRelease",
       "release"."isBestVideo"        AS "isBestVideo",
       "release"."incomplete"         AS "incomplete",
       "release"."isExclusiveRelease" AS "isExclusiveRelease",
       "release"."isBroken"           AS "isBroken"
FROM "shows_releases"
         LEFT JOIN "releases" AS "release" ON "shows_releases"."release" = "release"."id"
WHERE "shows_releases"."show" = ?`.trim()

    const and = title ? 'AND "release"."title" = ?' : ''
    return await sequelize.query(`${sql}${and};`, {
        replacements: [showId, title],
        type: QueryTypes.SELECT,
        raw: true,
    })
}
