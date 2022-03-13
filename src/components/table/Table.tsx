import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Box,
} from '@mui/material/'
import { visuallyHidden } from '@mui/utils'
import SearchBar from './SearchBar'
import Row from './Row'
import { Release, ReleaseList } from '../../utils/dbQueries'
import RowsFilter, {
    Filter,
    FilterContextProvider,
    useFilter,
} from './RowsFilter'

type Order = 'asc' | 'desc'

type SortableProperties = 'isMovie' | 'titles'

function getComparator(
    order: Order,
    orderBy: SortableProperties
): (a: Release, b: Release) => number {
    const descComp = (a: Release, b: Release): number => {
        if (a.show[orderBy] > b.show[orderBy]) {
            return 1
        } else if (a.show[orderBy] < b.show[orderBy]) {
            return -1
        } else {
            return 0
        }
    }

    const ascComp = (a: Release, b: Release): number => {
        const c = descComp(a, b)
        if (c === 1) {
            return -1
        } else if (c === -1) {
            return 1
        } else {
            return c
        }
    }

    if (order === 'desc') {
        return descComp
    } else {
        return ascComp
    }
}

interface HeadCell {
    id: string
    label: string
    align?: 'left' | 'center'
}

const headCells: readonly HeadCell[] = [
    {
        id: 'expandIcon',
        align: 'left',
        label: '',
    },
    {
        id: 'title',
        label: 'Title',
    },
    {
        id: 'isMovie',
        align: 'center',
        label: 'Movie',
    },
    {
        id: 'bestRelease',
        align: 'center',
        label: 'Best Release',
    },
    {
        id: 'altRelease',
        align: 'center',
        label: 'Alternate Release',
    },
]

interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: SortableProperties
    ) => void
    order: Order
    orderBy: SortableProperties
    rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props
    const createSortHandler = (property: string) => {
        if (property === 'isMovie' || property === 'title') {
            return (event: React.MouseEvent<unknown>) => {
                onRequestSort(
                    event,
                    property === 'isMovie' ? 'isMovie' : 'titles'
                )
            }
        }
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align ?? 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.id === 'isMovie' ||
                        headCell.id === 'title' ? (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={
                                        orderBy === headCell.id ? order : 'asc'
                                    }
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc'
                                                ? 'sorted descending'
                                                : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                <>{headCell.label}</>
                            )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

const EnhancedTableToolbar = () => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                justifyContent: 'space-between',
            }}
        >
            <Typography variant="h5" id="tableTitle" component="h5">
                Seadex
            </Typography>
            <SearchBar />
            <RowsFilter />
        </Toolbar>
    )
}

export function EnhancedTable({ rows }: { rows: ReleaseList }) {
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<SortableProperties>('titles')
    const { filter } = useFilter()

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: SortableProperties
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const doFilter = (anime: Release) => {
        switch (filter) {
        case Filter.ShowsOnly:
            return !anime.show.isMovie
        case Filter.MoviesOnly:
            return anime.show.isMovie
        case Filter.All:
            return true
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows
                                .filter(doFilter)
                                .sort(getComparator(order, orderBy))
                                .map((data) => (
                                    <Row
                                        show={data.show}
                                        releases={data.releases}
                                        key={data.show.id}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}

export default function FilteredTable({ rows }: { rows: ReleaseList }) {
    return (
        <FilterContextProvider>
            <EnhancedTable rows={rows} />
        </FilterContextProvider>
    )
}
