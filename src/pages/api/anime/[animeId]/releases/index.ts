import type {NextApiRequest, NextApiResponse} from 'next'
import {Show, Release, ShowRelease} from "../../../../../modals/";
import {randomUUID} from "crypto";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            // get all releases of anime
            // get release by title
            break;
        case 'POST':
            // add a new release for anime
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}
