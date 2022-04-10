import type { NextApiRequest, NextApiResponse } from 'next'
import Fuse from 'fuse.js'
import { getAllReleases, ReleaseWithType, ShowWithTitle } from '../../../../utils/dbQueries'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Fuse.FuseResult<{
        show: ShowWithTitle;
        releases: ReleaseWithType[];
    }>[]>
) {
    switch (req.method) {
    case 'GET': {
        const releases = await getAllReleases()
        const fuseOptions = {
            keys: ['show.id', 'show.titles.title']
        }
        const fuse = new Fuse(releases, fuseOptions)
        const results = fuse.search(req.query.q as string)
        res.json(results)
        break
    }
    default:
        res.setHeader('Allow', 'GET')
        res.status(405).end(`Method ${req.method} Nodt Allowed`)
        break
    }
}
