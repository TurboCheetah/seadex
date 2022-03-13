// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ensureServerAuth } from '../../utils/auth'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (await ensureServerAuth(req, res)) {
        return
    }
    res.status(200).json({ name: 'John Doe' })
}
