import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function ResponsiveDialog({open, setOpen}: {open: boolean, setOpen: (value: boolean) => void}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSave = () => {
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                fullWidth={true}
                maxWidth={'sm'}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle>Add a new anime</DialogTitle>
                <DialogContent>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                            gap: 3
                        }}
                    >
                        <TextField
                            autoFocus
                            label="Title"
                            fullWidth
                            variant="standard"
                        />

                        <TextField
                            autoFocus
                            label="Title"
                            fullWidth
                            variant="standard"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}
