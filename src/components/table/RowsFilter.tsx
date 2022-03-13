import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import FilterListIcon from '@mui/icons-material/FilterList'
import IconButton from '@mui/material/IconButton'
import { createContext, PropsWithChildren, useContext } from 'react'
import Tooltip from '@mui/material/Tooltip'

export enum Filter {
    All,
    ShowsOnly,
    MoviesOnly,
}

const defaultValue: { filter: Filter; setFilter?: (f: Filter) => void } = {
    filter: Filter.All,
}
export const FilterContext = createContext(defaultValue)

export function FilterContextProvider(props: PropsWithChildren<unknown>) {
    const [filter, setFilter] = React.useState(Filter.All)

    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {props.children}
        </FilterContext.Provider>
    )
}

export const useFilter = () => useContext(FilterContext)

const options = ['All', 'Shows Only', 'Movies Only']

export default function RowsFilter() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const { filter: selectedIndex, setFilter: setSelectedIndex } = useFilter()
    const open = Boolean(anchorEl)
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number
    ) => {
        setSelectedIndex && setSelectedIndex(index)
        setAnchorEl(null)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <Tooltip title="Filter anime">
                <IconButton onClick={handleClickListItem}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id="anime-filter-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'anime-filter-menu',
                    role: 'menu',
                }}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
