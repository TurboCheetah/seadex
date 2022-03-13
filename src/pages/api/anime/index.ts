import type { NextApiRequest, NextApiResponse } from 'next'
import Show from '../../../modals/Show'
import Release from '../../../modals/Release'
import ShowRelease from '../../../modals/ShowRelease'
import { randomUUID } from 'crypto'
import { sequelize } from '../../../db'
import { getAllReleases, ReleaseList } from '../../../utils/dbQueries'
import ShowName from '../../../modals/ShowName'
import { ensureServerAuth } from '../../../utils/auth'

interface CreateShowRequest {
    titles: { title: string; language: string }[]
    isMovie: true
    releases: [Release & { type: string }]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ReleaseList | { id: string }>
) {
    switch (req.method) {
    case 'GET': {
        const releases = await getAllReleases()
        res.json(releases)
        break
    }
    case 'POST': {
        if (await ensureServerAuth(req, res)) {
            return
        }

        const body = req.body as CreateShowRequest
        try {
            await sequelize.transaction(async () => {
                const createdShow = await Show.create({
                    id: randomUUID(),
                    isMovie: body.isMovie,
                })

                for (const title of body.titles) {
                    await ShowName.create({
                        title: title.title,
                        language: title.language,
                        show: createdShow.id,
                        id: randomUUID(),
                    })
                }

                for (const release of body.releases) {
                    const createdRelease = await Release.create({
                        ...release,
                        id: randomUUID(),
                    })
                    await ShowRelease.create({
                        show: createdShow.id,
                        release: createdRelease.id,
                        type: release.type,
                    })
                }
                res.status(201).json({id: createdShow.id})
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            res.status(500).end(e.toString())
        }
        break
    }
    default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }
}
