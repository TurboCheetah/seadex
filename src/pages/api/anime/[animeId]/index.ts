import type {NextApiRequest, NextApiResponse} from "next";
import ShowRelease from "../../../../modals/ShowRelease";
import Release from "../../../../modals/Release";
import {Op} from "sequelize";
import Show from "../../../../modals/Show";
import {sequelize} from "../../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { animeId: id } = req.query;
    switch (req.method) {
        case 'DELETE':
            try {
                await sequelize.transaction(async () => {
                    const showReleases = await ShowRelease.findAll({
                        where: {show: id}
                    })
                    console.log('here 1')
                    await Release.destroy({
                        where: {
                            [Op.or]: showReleases.map(it => ({id: it.release}))
                        }
                    })
                    console.log('here 2')
                    await Show.destroy({
                        where: {id}
                    })
                })

                res.status(200).end()
            } catch (e: any) {
                res.status(500).end(e.toString())
            }
            break;
        default:
            res.setHeader('Allow', ['DELETE'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }

    res.status(500).end()
}
