import type { NextApiRequest, NextApiResponse } from 'next'
import { Release, ShowRelease } from '../../../../../modals/'
import { randomUUID } from 'crypto'
import { getShowsReleases } from '../../../../../utils/dbQueries'
import { sequelize } from '../../../../../db'
import { ensureServerAuth } from '../../../../../utils/auth'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { animeId, title } = req.query
    switch (req.method) {
    case 'GET': {
        if (
            typeof animeId !== 'string' ||
                (title && typeof title !== 'string')
        ) {
            res.status(400).end()
            return
        }

        const releases = await getShowsReleases(animeId, title)
        if (releases.length > 0) {
            res.json(releases)
        } else {
            res.status(204).json([])
        }
        break
    }
    case 'POST': {
        if (await ensureServerAuth(req, res)) {
            return
        }
        const release = req.body
        await sequelize
            .transaction(async () => {
                const createdRelease = await Release.create({
                    ...release,
                    id: randomUUID(),
                })
                await ShowRelease.create({
                    show: animeId,
                    release: createdRelease.id,
                    type: release.type,
                })
            })
            .then(() => res.status(201).end())
        break
    }
    default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }
}
