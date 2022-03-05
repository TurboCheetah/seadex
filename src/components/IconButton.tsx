import {IconButton as MuiIconButton, IconButtonProps} from '@mui/material'

// eslint-disable-next-line @next/next/no-img-element
export const IconImage = ({icon}: { icon: string }) => <img src={icon} alt={`view on ${icon}`} style={{maxHeight: 32}}/>

const IconButton = ({icon, href, rest}: { icon: string, href: string, rest?: IconButtonProps }) => (
    <MuiIconButton {...rest}>
        <a href={href} target="_blank" rel="noreferrer">
            <IconImage icon={`/${icon}`}/>
        </a>
    </MuiIconButton>
)

export const NyaaIconButton = ({href}: { href?: string }) => href ? <IconButton icon={"nyaa.webp"} href={href}/> : <></>
export const BbtIconButton = ({href}: { href?: string }) => href ? <IconButton icon={"bbt.webp"} href={href}/> : <></>
export const ToshIconButton = ({href}: { href?: string }) => href ? <IconButton icon={"nyaa.webp"} href={href}/> : <></>
