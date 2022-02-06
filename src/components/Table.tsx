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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {ReleaseList, ReleaseWithType as Release, ShowWithTitle as Show} from "../utils/shows";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {useSession} from "next-auth/react";

// TODO display icon for release type
const ReleaseTypeTableCell = ({type}: { type: string }) => <TableCell align='center'>{type}</TableCell>;
const Boolean = ({value}: { value: boolean }) => value ? <DoneIcon/> : <CloseIcon/>;
const BooleanTableCell = ({value}: { value?: boolean }) => <TableCell align='center'>{value && <Boolean value={value}/>}</TableCell>

export interface RowProps {
    show: Show,
    releases: Release[]
}

const DisplayRelease = ({release}: {release?: Release}) => {
    return (
        <>
            <ReleaseTypeTableCell type={release?.type ?? ''} />
            <TableCell align='center'>{release?.title}</TableCell>
            <TableCell align='center'>{release?.releaseGroup}</TableCell>
            <TableCell align='center'>{release?.notes}</TableCell>
            <BooleanTableCell value={release?.dualAudio}/>
            <BooleanTableCell value={release?.isBestVideo}/>
            <BooleanTableCell value={release?.incomplete}/>
            <BooleanTableCell value={release?.isExclusiveRelease}/>
            <BooleanTableCell value={release?.isBroken}/>
            <TableCell align='center'>{release?.nyaaLink}</TableCell>
        </>

    )
}

function ReleasesRows(props: { releases: Release[] }) {
    const cols = ["", "Title", "Group", "Notes", "Dual Audio", "Best Video", "Incomplete", "Exclusive Release", "Broken", "Watch On"]

    const releases = new Map<string, Release[]>();
    props.releases.forEach(r => {
        const rs = releases.get(r.title) ?? []
        rs.push(r)
        releases.set(r.title, rs)
    })

    const displaySeason = (season: string) => {
        console.log('displaying season', season)
        const seasonReleases = releases.get(season)
        return (
            <>
                <Typography variant="h6" gutterBottom component="div">
                    {season}
                </Typography>
                <Table size="small" aria-label="season">
                    <TableHead>
                        <TableRow>
                            {cols.map(it => <TableCell align='center' key={it}>{it}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {seasonReleases?.map((release) => (
                            <TableRow key={release.id}>
                                <DisplayRelease release={release}/>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>

        )
    }
    return (
        <>
            {Array.from(releases.keys()).sort().map(displaySeason)}
        </>
    )
}

function Row({show, releases}: RowProps) {
    const {data: session} = useSession()
    const [open, setOpen] = useState(false);
    const bestRelease = releases.find(it => it.type === 'best');
    const altRelease = releases.find(it => it.type === 'alternative');

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {show.titles.map(({title, id}) => (
                        <p key={id}>{title}</p>
                    ))}
                </TableCell>
                <TableCell align='center'>
                    {bestRelease?.releaseGroup}
                    &nbsp;nyaa
                </TableCell>
                <TableCell align='center'>
                    {altRelease?.releaseGroup}
                    &nbsp;nyaa
                </TableCell>
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
                            <ReleasesRows releases={releases} />
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

export default function StickyHeadTable({releases}: TableProps) {
    const {data: session} = useSession()
    return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 'calc(100vh - 69px)'}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Title</TableCell>
                            {["Best", "Alternative"].map(it => <TableCell align='center' key={it}>{it}</TableCell>)}
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
