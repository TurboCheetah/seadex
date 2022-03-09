import React, {useEffect, useRef, useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {ReleaseList, ReleaseWithType as Release, ShowRelease, ShowWithTitle as Show} from "../utils/dbQueries";
import DeleteIcon from '@mui/icons-material/Delete';
import {useSession} from "next-auth/react";
import {BbtIconButton, NyaaIconButton, ToshIconButton} from "./IconButton";
import HelpIcon from '@mui/icons-material/Help';
import {groupByKey} from "../utils/fns";
import {useRouter} from "next/router";
import {VirtualizedTable} from "./table/VirtualizedTable";
import {TableCell} from "./table/MuiWrappers";
import MuiTableCell from '@mui/material/TableCell';
import {ROW_HEIGHT} from "./table/constants";
import {styled} from "@mui/material/styles";
import {useLanguage} from "../utils/hooks";


export interface RowProps {
    show: Show,
    releases: Release[]
    style: object
}

const DisplayRelease = ({release, comp: Comp = CenteredTableCell}: { release?: Release, comp?: React.ReactNode }) => {
    const children = release ? (<>
        <Typography sx={{p: 1, display: "inline", cursor: 'text'}}>{release?.releaseGroup}</Typography>
        <NyaaIconButton href={release.nyaaLink}/>
        <BbtIconButton href={release.bbtLink}/>
        <ToshIconButton href={release.toshLink}/>
    </>) : <></>
    return (
        <Comp align='center' component='div'>
            {children}
        </Comp>
    )
}

function TitleTableCell({title, comp: Comp = CenteredTableCell}: { title: string, comp?: React.ReactNode }) {
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
        <Comp align='center'>
            <Box sx={{display: 'flex', gap: 1.5, justifyContent: 'center'}}>
                {title}
                <Tooltip title={desc}>
                    <HelpIcon/>
                </Tooltip>
            </Box>
        </Comp>
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
                <TableCell>
                    {season}
                </TableCell>
                <DisplayRelease comp={MuiTableCell} release={bestRelease}/>
                <DisplayRelease comp={MuiTableCell} release={altRelease}/>
            </TableRow>
        )
    }
    return (
        <>
            <Table size="small" aria-label="season">
                <TableHead>
                    <TableRow>
                        <TableCell align='center'/>
                        <TitleTableCell comp={MuiTableCell} title="Best"/>
                        <TitleTableCell comp={MuiTableCell} title="Alternative"/>
                    </TableRow>
                </TableHead>
                {Array.from(Object.keys(releases)).sort().map(displaySeason)}
            </Table>
        </>
    )
}

const CenteredTableCell = styled(TableCell)({
    display: 'flex', alignItems: 'center'
})

function Row({show, releases, style}: RowProps) {
    console.log('got row', show, releases)
    const {data: session} = useSession()
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const language = useLanguage()

    const bestRelease = releases.find(it => it.type === 'best');
    const altRelease = releases.find(it => it.type === 'alternative');
    const grouped = groupByKey(releases, 'title')
    const moreThan1 = Object.keys(grouped).length > 1

    const title = show.titles.find(it => it.language === language)?.title

    const releaseIfOne = (release?: Release) => moreThan1 ? <CenteredTableCell component="div" align='center'/> :
        <DisplayRelease release={release}/>

    const navigateToAnimePage = async () => {
        if (!moreThan1) {
            await router.push(`/anime/${show.id}`)
        }
    }

    return (
        <TableRow
            component='div'
            hover={!moreThan1}
            onClick={navigateToAnimePage}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                cursor: (!moreThan1) ? 'pointer' : 'inherit',
                flexDirection: 'column',
                ...style
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <CenteredTableCell>
                    {moreThan1 && <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>}
                </CenteredTableCell>
                <CenteredTableCell scope="row">
                    {title}
                </CenteredTableCell>
                {releaseIfOne(bestRelease)}
                {releaseIfOne(altRelease)}
                {session && <CenteredTableCell scope="row">
                    <IconButton><DeleteIcon/></IconButton>
                </CenteredTableCell>}
            </Box>

            <TableRow component='div'>
                <TableCell component='div' sx={{py: 0}} colSpan={session ? 10 : 9}>
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
        </TableRow>
    );
}

export interface TableProps {
    releases: ReleaseList
}

export default function ShowsListTable({releases}: TableProps) {
    const {data: session} = useSession()

    const [containerHeight, setContainerHeight] = useState(300);
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setContainerHeight(containerRef.current?.scrollHeight ?? 300)
    }, [])

    return (
        <Paper sx={{width: '100%', height: 'calc(100vh - (69px))'}} ref={containerRef}>
            <VirtualizedTable
                height={containerHeight}
                rowHeight={ROW_HEIGHT}
                header={<>
                    <MuiTableCell component='div' sx={{width: '100%'}} />
                    <MuiTableCell component='div' sx={{width: '100%'}}>Title</MuiTableCell>
                    <TitleTableCell title="Best"/>
                    <TitleTableCell title="Alternative"/>
                    {session && <MuiTableCell component='div' sx={{width: '100%'}}>Actions</MuiTableCell>}
                </>}
                rowCount={releases.length}
                rowGetter={({index}) => releases[index]}
                displayRow={(data: ShowRelease, style) => <Row show={data.show} releases={data.releases} key={data.show.id} style={style} />}
            />
        </Paper>
    );
}
