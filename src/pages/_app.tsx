import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react"
import {useMemo} from "react";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: 'dark',
        },
    }), [])
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
    )
}
