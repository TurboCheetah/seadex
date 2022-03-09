import MuiTableCell, {TableCellProps} from '@mui/material/TableCell';
import React from "react";
import {ROW_HEIGHT} from "./constants";

export const TableCell = (props: TableCellProps) => {
    return (
        <MuiTableCell
            component='div'
            variant="body"
            {...props}
            sx={{height: ROW_HEIGHT, width: '100%', display: 'block', ...(props.sx)}}
        >
            {props.children}
        </MuiTableCell>
    )
}
