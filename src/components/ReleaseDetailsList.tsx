import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {IconImage} from "./IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import {ReleaseWithType as Release} from "../utils/dbQueries";
import List from "@mui/material/List";
import NestedList from "./NestedList";
import NotesIcon from "@mui/icons-material/Notes";
import {Typography} from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
import DownloadIcon from "@mui/icons-material/Download";

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
const ReleaseLinkListItem = ({link, site}: { link?: string, site: string }) => {
    return link ? <ListItemButton sx={{pl: 4}} component="a" href={`${link}`} target="_blank">
        <ListItemIcon>
            <IconImage icon={`/${site.toLowerCase()}.webp`}/>
        </ListItemIcon>
        <ListItemText primary={site}/>
    </ListItemButton> : <></>
}

export default function ReleaseDetailsList({release}: { release: Release }) {
    return (
        <List>
            <Boolean value={release.type === 'best'} title="Best release"/>
            <Boolean value={release.dualAudio} title="Dual audio"/>
            <Boolean value={!release.isRelease} title="Not a release"/>
            <Boolean value={release.isBestVideo} title="Best video"/>
            <Boolean value={release.incomplete} title="Incomplete"/>
            <Boolean value={release.isExclusiveRelease} title="Exclusive Release"/>
            <Boolean value={release.isBroken} title="Broken"/>
            {release.notes && <NestedList icon={NotesIcon} text="Notes">
                <Typography sx={{pl: 4, pr: 2, py: 1}}>{release.notes}</Typography>
            </NestedList>}
            {release.comparisons && <NestedList icon={CompareIcon} text="Comparisons">
                <Typography sx={{pl: 4, pr: 2, py: 1}}>{release.comparisons}</Typography>
            </NestedList>}

            <NestedList icon={DownloadIcon} text="Downloads">
                <List component="div" disablePadding>
                    <ReleaseLinkListItem link={release.nyaaLink} site="Nyaa"/>
                    <ReleaseLinkListItem link={release.bbtLink} site="BBT"/>
                    <ReleaseLinkListItem link={release.toshLink} site="Tosh"/>
                </List>
            </NestedList>
        </List>)
}
