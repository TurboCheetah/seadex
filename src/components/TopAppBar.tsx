import * as React from 'react';
import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {signIn, signOut, useSession} from "next-auth/react"
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import {useRouter} from "next/router";

export default function TopAppBar() {
    const {data: session} = useSession()
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = async () => {
        await signOut();
        handleCloseUserMenu()
    }

    const userMenu = session?.user && (
        <Box sx={{ flexGrow: 0, margin: 2 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={session.user.name ?? 'username'} src={session.user.image ?? undefined} />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={logout}>
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );

    const router = useRouter()

    const navigateToHome = () => router.push("/")

    return (
        <Box sx={{flexGrow: 1, height: 69}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        onClick={navigateToHome}
                        aria-label="navigate to home"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}, cursor: 'pointer'}}
                    >
                        Seadex
                    </Typography>

                    {session ? userMenu : <Button color="inherit" sx={{ margin: 2 }} onClick={() => signIn()}>Login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
