import type {NextApiRequest, NextApiResponse} from "next";
import {Release, ShowRelease} from "../../../../../modals/";
import {sequelize} from "../../../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {releaseId: id} = req.query;
    switch (req.method) {
    case 'DELETE':
        try {
            await sequelize.transaction(async () => {
                await Promise.all([
                    Release.destroy({
                        where: {id}
                    }),
                    ShowRelease.destroy({
                        where: {release: id}
                    })
                ])
            })

            res.status(200).end()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
