import {useSession} from "next-auth/react";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {groupByKey} from "../../utils/fns";
import {ReleaseWithType as Release, ShowWithTitle as Show} from "../../utils/dbQueries";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {BbtIconButton, NyaaIconButton, ToshIconButton} from "../IconButton";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import {Boolean} from "../Boolean";
import {useLanguage} from "../../utils/hooks";

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

export interface RowProps {
    show: Show,
    releases: Release[]
}

export default function Row({show, releases}: RowProps) {
    const {data: session} = useSession()
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const lang = useLanguage()

    const bestRelease = releases.find(it => it.type === 'best');
    const altRelease = releases.find(it => it.type === 'alternative');
    const grouped = groupByKey(releases, 'title')
    const moreThan1 = Object.keys(grouped).length > 1
    const title = show.titles.find(it => it.language === lang)?.title

    const releaseIfOne = (release?: Release) => moreThan1 ? <TableCell align='center'/> :
        <DisplayRelease release={release}/>

    const navigateToAnimePage = async () => {
        if (!moreThan1) {
            await router.push(`/anime/${show.id}`)
        }
    }
    console.log('isMovie', show.isMovie)
    return (
        <>
            <TableRow sx={{
                '& > *': {borderBottom: 'unset'},
                cursor: (!moreThan1) ? 'pointer' : 'inherit'
            }} hover={!moreThan1} onClick={navigateToAnimePage}>
                <TableCell>
                    {moreThan1 && <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>}
                </TableCell>
                <TableCell scope="row">
                    {title}
                </TableCell>
                <TableCell align='center'>
                    <Boolean value={show.isMovie} />
                </TableCell>
                {releaseIfOne(bestRelease)}
                {releaseIfOne(altRelease)}
                {session && <TableCell scope="row">
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
        </>
    );
}
