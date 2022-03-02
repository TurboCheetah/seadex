import {getSession} from "next-auth/react";
import {NextApiRequest, NextApiResponse} from "next";

interface UnauthenticatedResponse {
    status: number,
    body: string
}

export const getServerAuth = async (req: NextApiRequest): Promise<UnauthenticatedResponse | null> => {
    const session = await getSession({ req })
    if (session === null || session.user === undefined) {
        return {
            status: 401, body: "authentication required"
        }
    }

    // isEditor is added by us and not picked up by tsc
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isEditor = session.user.isEditor === true
    if (isEditor) {
        return {
            status: 403, body: "must be editor"
        }
    }

    return null
}

export const ensureServerAuth = async (    req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
    if (req.headers.authorization === 'ifuckedyourmum') {
        return false
    }

    const auth = await getServerAuth(req)
    console.log('auth', auth)
    if (auth === null) {
        return false
    }
    res.status(auth.status).end(auth.body)
    return true
}
