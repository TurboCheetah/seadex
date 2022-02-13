import type {NextApiRequest, NextApiResponse} from "next";
import ShowRelease from "../../../../../modals/ShowRelease";
import Release from "../../../../../modals/Release";
import {sequelize} from "../../../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { releaseId: id } = req.query;
    switch (req.method) {
        case 'DELETE':
            try {
                await sequelize.transaction(async () => {
                    await Release.destroy({
                        where: {
                            id
                        }
                    })

                    await ShowRelease.destroy({
                        where: {show: id}
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
