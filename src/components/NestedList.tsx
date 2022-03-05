import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {PropsWithChildren, useState} from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import type {Icon} from "@mui/material";

type Props = PropsWithChildren<{
    icon: typeof Icon,
    text: string
}>

export default function NestedList({ children, text, icon: Icon}: Props) {
    const [showingInner, setShowingInner] = useState(false);

    const showInner = () => {
        setShowingInner(!showingInner);
    };

    return (
        <>
            <ListItemButton onClick={showInner}>
                <ListItemIcon>
                    <Icon/>
                </ListItemIcon>
                <ListItemText primary={text} />
                {showingInner ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={showingInner} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    )
}
