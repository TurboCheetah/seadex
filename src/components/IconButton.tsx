import { IconButton as MuiIconButton, IconButtonProps } from '@mui/material'
import Image from 'next/image'

export const IconImage = ({ icon }: { icon: string }) => (
    <Image src={icon} alt={`view on ${icon}`} width={32} height={32} />
)

const IconButton = ({
    icon,
    href,
    rest,
}: {
    icon: string
    href: string
    rest?: IconButtonProps
}) => (
    <MuiIconButton {...rest}>
        <a href={href} target="_blank" rel="noreferrer">
            <IconImage icon={`/${icon}`} />
        </a>
    </MuiIconButton>
)

export const NyaaIconButton = ({ href }: { href?: string }) =>
    href ? <IconButton icon={'nyaa.webp'} href={href} /> : <></>
export const BbtIconButton = ({ href }: { href?: string }) =>
    href ? <IconButton icon={'bbt.webp'} href={href} /> : <></>
export const ToshIconButton = ({ href }: { href?: string }) =>
    href ? <IconButton icon={'nyaa.webp'} href={href} /> : <></>
