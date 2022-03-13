import type { NextApiRequest, NextApiResponse } from 'next'
import { Release, Show, ShowName, ShowRelease } from '../../../../modals/'
import { Op } from 'sequelize'
import { sequelize } from '../../../../db'
import { ensureServerAuth } from '../../../../utils/auth'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { animeId: id } = req.query
    switch (req.method) {
    case 'DELETE':
        if (await ensureServerAuth(req, res)) {
            return
        }
        try {
            await sequelize.transaction(async () => {
                const showReleases = await ShowRelease.findAll({
                    where: { show: id },
                })

                await Promise.all([
                    ShowRelease.destroy({
                        where: { show: id },
                    }),
                    Release.destroy({
                        where: {
                            [Op.or]: showReleases.map((it) => ({
                                id: it.release,
                            })),
                        },
                    }),
                    ShowName.destroy({
                        where: { show: id },
                    }),
                    Show.destroy({
                        where: { id },
                    }),
                ])
            })

            res.status(200).end()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            res.status(500).end(e.toString())
        }
        break
    default:
        res.setHeader('Allow', ['DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }

    res.status(500).end()
}
