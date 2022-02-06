import React, {useState, SyntheticEvent} from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}


export default function CenteredTabs({value, setValue}: {value: number, setValue: (value: number) => void}) {
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Shows" />
                <Tab label="Movies" />
            </Tabs>
        </Box>
    );
}
