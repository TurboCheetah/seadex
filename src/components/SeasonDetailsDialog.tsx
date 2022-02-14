import * as React from 'react';
import {useState} from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogBase from "./DialogBase";
import {ReleaseWithType as Release} from "../utils/dbQueries";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import {ExpandLess} from "@mui/icons-material";
import {IconImage} from "./IconButton";
import {useTheme} from "@mui/material/styles";

const Boolean = ({value, title}: { value: boolean, title: string }) => {
    return (
        <ListItem>
            <ListItemIcon>
                {value ? <DoneIcon/> : <CloseIcon/>}
            </ListItemIcon>
            <ListItemText primary={title}/>
        </ListItem>
    )
}

const ReleaseLinkListItem = ({link, site}: {link?: string, site: string}) => {
    return link ? <ListItemButton sx={{pl: 4}} component="a" href={link} target="_blank">
        <ListItemIcon>
            <IconImage icon={`${site.toLowerCase()}.webp`} />
        </ListItemIcon>
        <ListItemText primary={site}/>
    </ListItemButton> : <></>
}

function DisplayRelease({release}: { release: Release }) {
    const [showingDownloads, setShowingDownloads] = useState(false);

    const showDownloads = () => {
        setShowingDownloads(!showingDownloads);
    };

    console.log(release)
    return <Box>
        <Typography component="h3" variant="h5">
            {release.releaseGroup}
        </Typography>
        <List>
            <Boolean value={release.type === 'best'} title="Best release"/>
            <Boolean value={release.dualAudio} title="Dual audio"/>
            <Boolean value={!release.isRelease} title="Not a release"/>
            <Boolean value={release.isBestVideo} title="Best video"/>
            <Boolean value={release.incomplete} title="Incomplete"/>
            <Boolean value={release.isExclusiveRelease} title="Exclusive Release"/>
            <Boolean value={release.isBroken} title="Broken"/>

            <ListItemButton onClick={showDownloads}>
                <ListItemIcon>
                    <DownloadIcon/>
                </ListItemIcon>
                <ListItemText primary="Downloads"/>
                {showingDownloads ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={showingDownloads} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ReleaseLinkListItem link={release.nyaaLink} site="Nyaa" />
                    <ReleaseLinkListItem link={release.bbtLink} site="BBT" />
                    <ReleaseLinkListItem link={release.toshLink} site="Tosh" />
                </List>
            </Collapse>
        </List>
    </Box>;
}

interface Props {
    open: boolean
    setOpen: (value: boolean) => void
    releases?: Release[]
    season?: string
    showTitle?: string
}

export default function SeasonDetailsDialog({open, setOpen, releases, season, showTitle}: Props) {
    const theme = useTheme()
    const sorted = releases?.sort((left, right) => {
        if (left.type == 'best') {
            return -1
        } else if (right.type == 'best') {
            return 1
        } else {
            return 0
        }
    })
    return (
        <DialogBase
            open={open}
            setOpen={setOpen}
            maxWidth="md"
        >
            <DialogTitle>{showTitle} - {season}</DialogTitle>
            <DialogContent sx={{display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(min(15rem, 100%), 1fr))", gridGap: theme.spacing(2)}}>
                {sorted?.map(release => <DisplayRelease key={release.id} release={release}/>)}
            </DialogContent>
        </DialogBase>
    );
}
