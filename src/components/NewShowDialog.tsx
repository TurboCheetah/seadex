import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DialogBase from "./DialogBase";

export default function NewShowDialog({open, setOpen}: { open: boolean, setOpen: (value: boolean) => void }) {

    const handleSave = () => {
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <DialogBase
            open={open}
            setOpen={setOpen}
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

        </DialogBase>
    );
}
