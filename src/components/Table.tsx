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

const Boolean = ({value}: { value: boolean }) => value ? <DoneIcon/> : <CloseIcon/>;
const BooleanTableCell = ({value}: { value?: boolean }) => <TableCell align='center'>{value && <Boolean value={value}/>}</TableCell>

export interface RowProps {
    show: Show,
    releases: Release[]
}
const cols = ["", "Group", "Notes", "Dual Audio", "Best Video", "Incomplete", "Exclusive Release", "Broken", "Watch On"]

const DisplayRelease = ({release}: {release?: Release}) => {
    return (
        <>
            {/* TODO display icon for release type */}
            <TableCell align='center'>{release?.type}</TableCell>
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

function Row({show, releases}: RowProps) {
    const {data: session} = useSession()
    const [open, setOpen] = useState(false);


    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    {releases.length > 1 && <IconButton
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
                {<DisplayRelease release={releases.length === 1 ? releases[0] : undefined} />}
                {session && <TableCell component="th" scope="row">
                    <IconButton><DeleteIcon/></IconButton>
                </TableCell>}
            </TableRow>
            {releases.length > 1 && <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={session ? 10 : 9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Releases
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        {cols.map(it => <TableCell align='center' key={it}>{it}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {releases.map((release) => (
                                        <TableRow key={release.id}>
                                            <DisplayRelease release={release}/>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>}
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
                            {cols.map(it => <TableCell align='center' key={it}>{it}</TableCell>)}
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
