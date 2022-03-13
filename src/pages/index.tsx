import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { getAllReleases, ReleaseList } from '../utils/dbQueries'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'
import { useSession } from 'next-auth/react'
import EnhancedTable from '../components/table/Table'
import { useRouter } from 'next/router'

const Home: NextPage<{ releases: string }> = (props) => {
    const { data: session } = useSession()
    const router = useRouter()
    const handleClickOpen = async () => {
        await router.push('/anime/new')
    }

    const releases = JSON.parse(props.releases) as ReleaseList
    const newShowStuff = session && (
        <>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'absolute', right: 24, bottom: 24 }}
                onClick={handleClickOpen}
            >
                <AddIcon />
            </Fab>
        </>
    )
    return (
        <>
            <Head>
                <title>Seadex</title>
                <meta name="description" content="A Certain Smoke's Index" />
            </Head>
            <main>
                <EnhancedTable rows={releases} />
            </main>
            {newShowStuff}
        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const allReleases = await getAllReleases()
    return {
        props: {
            releases: JSON.stringify(allReleases),
        },
    }
}

export default Home
