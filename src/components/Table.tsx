import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {ReleaseList, ReleaseWithType as Release, ShowWithTitle as Show} from "../utils/dbQueries";
import DeleteIcon from '@mui/icons-material/Delete';
import {useSession} from "next-auth/react";
import {BbtIconButton, NyaaIconButton, ToshIconButton} from "./IconButton";
import HelpIcon from '@mui/icons-material/Help';
import {groupByKey} from "../utils/fns";
import {useRouter} from "next/router";

export interface RowProps {
    show: Show,
    releases: Release[]
}

const DisplayRelease = ({release}: { release?: Release }) => {
    const children = release ? (<>
        <Typography sx={{p: 1, display: "inline", cursor: 'text'}}>{release?.releaseGroup}</Typography>
        <NyaaIconButton href={release.nyaaLink}/>
        <BbtIconButton href={release.bbtLink}/>
        <ToshIconButton href={release.toshLink}/>
    </>) : <></>
    return (
        <TableCell align='center'>
            {children}
        </TableCell>
    )
}

function TitleTableCell({title}: { title: string }) {
    let desc;
    switch (title) {
    case 'Best':
        desc = 'best release'
        break
    case 'Alternative':
        desc = 'alt release'
        break
    default:
        throw Error('unreachable')
    }
    return (
        <TableCell align='center'>
            <Box sx={{display: 'flex', gap: 1.5, justifyContent: 'center'}}>
                {title}
                <Tooltip title={desc}>
                    <HelpIcon/>
                </Tooltip>
            </Box>
        </TableCell>
    )
}

function ReleasesRows(props: { releases: Release[], show: Show }) {
    const releases = groupByKey(props.releases, 'title');
    const router = useRouter()

    const displaySeason = (season: string) => {
        const seasonReleases = releases[season]
        if (seasonReleases === undefined) {
            return <></>
        }

        const bestRelease = seasonReleases.find(it => it.type === 'best');
        const altRelease = seasonReleases.find(it => it.type === 'alternative');

        const navigateToAnimePage = async () => {
            await router.push(`/anime/${props.show.id}?title=${season}`)
        }

        return (
            <TableRow hover sx={{cursor: 'pointer'}} onClick={navigateToAnimePage}>
                <TableCell align='center'>
                    {season}
                </TableCell>
                <DisplayRelease release={bestRelease}/>
                <DisplayRelease release={altRelease}/>
            </TableRow>
        )
    }
    return (
        <>
            <Table size="small" aria-label="season">
                <TableHead>
                    <TableRow>
                        <TableCell align='center'/>
                        <TitleTableCell title="Best"/>
                        <TitleTableCell title="Alternative"/>
                    </TableRow>
                </TableHead>
                {Array.from(Object.keys(releases)).sort().map(displaySeason)}
            </Table>
        </>
    )
}

function Row({show, releases}: RowProps) {
    const {data: session} = useSession()
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const bestRelease = releases.find(it => it.type === 'best');
    const altRelease = releases.find(it => it.type === 'alternative');
    const grouped = groupByKey(releases, 'title')
    const moreThan1 = Object.keys(grouped).length > 1

    const releaseIfOne = (release?: Release) => moreThan1 ? <TableCell align='center'/> :
        <DisplayRelease release={release}/>

    const navigateToAnimePage = async () => {
        if (!moreThan1) {
            await router.push(`/anime/${show.id}`)
        }
    }
    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}} hover={!moreThan1} onClick={navigateToAnimePage}>
                <TableCell>
                    {moreThan1 && <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>}
                </TableCell>
                <TableCell component="th" scope="row">
                    {show.titles.map(({title, id}) => (
                        <p key={id}>{title}</p>
                    ))}
                </TableCell>
                {releaseIfOne(bestRelease)}
                {releaseIfOne(altRelease)}
                {session && <TableCell component="th" scope="row">
                    <IconButton><DeleteIcon/></IconButton>
                </TableCell>}
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={session ? 10 : 9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h5" gutterBottom component="div">
                                Releases
                            </Typography>
                            <ReleasesRows releases={releases} show={show}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export interface TableProps {
    releases: ReleaseList
}

export default function ShowsListTable({releases}: TableProps) {
    const {data: session} = useSession()
    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 'calc(100vh - (69px + 48px))'}}>
                <Table stickyHeader aria-label="anime list table">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Title</TableCell>
                            <TitleTableCell title="Best"/>
                            <TitleTableCell title="Alternative"/>
                            {session && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {releases.map(({show, releases}) => <Row show={show} releases={releases} key={show.id}/>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
