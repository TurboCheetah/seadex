import * as React from 'react';
import {PropsWithChildren} from 'react';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {Breakpoint} from "@mui/material";

export type Props = PropsWithChildren<{ open: boolean, setOpen: (value: boolean) => void, maxWidth?: Breakpoint }>

export default function DialogBase({open, setOpen, children, maxWidth = "sm"}: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                fullWidth={true}
                maxWidth={maxWidth}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                {children}
            </Dialog>
        </div>
    );
}
