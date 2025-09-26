import React from "react";
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        // <TableContainer component={Paper}>
        <Table>
            <TableBody>
                {[...Array(rows)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {[...Array(columns)].map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton variant="text" width="100%" height={30} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        // </TableContainer>
    );
};

export default TableSkeleton;
