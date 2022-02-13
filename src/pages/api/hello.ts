// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from "next-auth/react";

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getSession({req})

    if (session === null) {
        res.status(401).end('Authentication required')
        return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isEditor = session.user?.isEditor === true
    console.log(isEditor)
    res.status(200).json({name: 'John Doe'})
}
