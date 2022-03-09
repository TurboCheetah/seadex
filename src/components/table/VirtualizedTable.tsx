import * as React from 'react';
import {withStyles, WithStyles} from '@mui/styles';
import {Theme} from '@mui/material/styles';
import {FixedSizeList as List} from 'react-window';
import {TableHead, TableRow} from "@mui/material";
import {ReactNode} from "react";

const styles = (theme: Theme) =>
    ({
        flexContainer: {
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        tableRow: {
            cursor: 'pointer',
        },
        tableRowHover: {
            '&:hover': {
                backgroundColor: theme.palette.grey[200],
            },
        },
        tableCell: {
            flex: 1,
        },
        noClick: {
            cursor: 'initial',
        },
    } as const);

interface Row {
    index: number;
}

interface MuiVirtualizedTableProps<D> extends WithStyles<typeof styles> {
    header: ReactNode;
    rowCount: number;
    rowGetter: (row: Row) => D;
    rowHeight?: number;
    height: number;
    width?: number;
    displayRow: (row: D, style: object) => ReactNode | Element
}

function MuiVirtualizedTable<D>(props: MuiVirtualizedTableProps<D>) {
    const {rowCount, rowGetter, rowHeight = 48, height, width = '100%', header, displayRow} = props;

    const Row = ({index, style}: { index: number, style: object }) => {
        const row = rowGetter({index})
        return (
            <>
                {displayRow(row, style)}
            </>
        )
    };
    return (
        <>
            <TableHead component='div' sx={{width, display: 'block'}}>
                <TableRow component='div' sx={{width, display: 'flex', justifyContent: 'space-between'}}>
                    {header}
                </TableRow>
            </TableHead>
            <List
                height={height}
                itemCount={rowCount}
                itemSize={rowHeight}
                width={width}>
                {Row}
            </List>
        </>
    );
}

export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

/*

interface Data {
    calories: number;
    carbs: number;
    dessert: string;
    fat: number;
    id: number;
    protein: number;
}

const sample: readonly [string, number, number, number, number][] = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(
    id: number,
    dessert: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): Data {
    return {id, dessert, calories, fat, carbs, protein};
}

const rows: Data[] = [];

for (let i = 0; i < 500; i += 1) {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    rows.push(createData(i, ...randomSelection));
}

export default function ReactVirtualizedTable() {
    const [containerHeight, setContainerHeight] = useState(300);
    // const [containerWidth, setContainerWidth] = useState(1000);
    const paperRef = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        setContainerHeight(paperRef.current?.scrollHeight ?? 300)
        // setContainerWidth(paperRef.current?.scrollWidth ?? 500)
    }, [])

    return (
        <Paper style={{height: '100%', width: '100%'}} ref={paperRef} component='div'>
            <VirtualizedTable
                height={containerHeight}
                // width={containerWidth}
                rowCount={rows.length}
                rowGetter={({index}) => rows[index]}
                columns={[
                    {
                        align: 'left',
                        label: 'Dessert',
                        dataKey: 'dessert',
                    },
                    {
                        align: 'center',
                        label: 'Calories\u00A0(g)',
                        dataKey: 'calories',
                    },
                    {
                        align: 'center',
                        label: 'Fat\u00A0(g)',
                        dataKey: 'fat',
                    },
                ]}
            />
        </Paper>
    );
}
*/
