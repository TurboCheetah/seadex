import type {GetServerSidePropsContext, NextPage} from 'next'
import Head from 'next/head'
import Table from "../components/Table";
import {getAllReleases, ReleaseList} from "../utils/shows";
import TopAppBar from "../components/TopAppBar";
import NewShowDialog from "../components/NewShowDialog";
import Tabs, { TabPanel } from "../components/TabBar";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import * as React from "react";
import {useSession} from "next-auth/react";
import {useState} from "react";
import SwipeableViews from 'react-swipeable-views';
import {useTheme} from "@mui/material/styles";

const Home: NextPage<{ releases: string }> = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const {data: session} = useSession()
    const theme = useTheme();

    const handleClickOpen = () => {
        setOpen(true);
    };


    const releases = JSON.parse(props.releases) as ReleaseList;
    const newShowStuff = session && (
        <>
            <NewShowDialog open={open} setOpen={setOpen}/>
            <Fab color="primary" aria-label="add" sx={{position: 'absolute', right: 24, bottom: 24}}
                onClick={handleClickOpen}>
                <AddIcon/>
            </Fab>
        </>
    )
    return (
        <>
            <Head>
                <title>Seadex</title>
                <meta name="description" content="A Certain Smoke's Index"/>
            </Head>
            <TopAppBar/>
            <main>
                <Tabs value={value} setValue={setValue} />
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={(v) => setValue(v)}
                >
                    <TabPanel value={value} index={0}>
                        <Table releases={releases.filter(it => !it.show.isMovie)}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Table releases={releases.filter(it => it.show.isMovie)}/>
                    </TabPanel>
                </SwipeableViews>
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
            releases: JSON.stringify(allReleases)
        }
    }
}

export default Home
