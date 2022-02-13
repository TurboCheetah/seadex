import type {NextApiRequest, NextApiResponse} from 'next'
import Show from "../../../modals/Show";
import Release from "../../../modals/Release";
import ShowRelease from "../../../modals/ShowRelease";
import {randomUUID} from "crypto";
import {sequelize} from "../../../db";
import {getAllReleases, ReleaseList} from "../../../utils/shows";
import {getSession} from "next-auth/react";
import ShowName from "../../../modals/ShowName";

interface CreateShowRequest {
    title: { title: string, lang: string }[]
    isMovie: true,
    releases: [Release & { type: string }]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ReleaseList>
) {
    const session = await getSession({ req })
    switch (req.method) {
        case 'GET':
            const releases = await getAllReleases()
            console.log('releases', releases)
            res.json(releases)
            break;
        case 'POST':
/*
            if (session === null) {
                res.status(401).end('Authentication required')
                return
            }
            // @ts-ignore
            const isEditor = session.user?.isEditor === true
            if (isEditor) {
                res.status(403).end('Must be editor')
                return
            }
*/
            const body = req.body as CreateShowRequest
            try {
                await sequelize.transaction(async () => {
                    const createdShow = await Show.create({
                        id: randomUUID(),
                        isMovie: body.isMovie,
                    })

                    for (const title of body.title) {
                        await ShowName.create({
                            title: title.title,
                            language: title.lang,
                            show: createdShow.id,
                            id: randomUUID(),
                        })
                    }

                    for (const release of body.releases) {
                        const createdRelease = await Release.create({
                            ...release,
                            id: randomUUID()
                        })
                        await ShowRelease.create({
                            show: createdShow.id,
                            release: createdRelease.id,
                            type: release.type
                        })
                    }
                    res.status(201).end()
                })
            } catch (e: any) {
                res.status(500).end(e.toString())
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}
