import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-toastify/dist/ReactToastify.css';
import { StyledTableCell } from '../commons/StyledTable' 
import { StyledTableRow } from '../commons/StyledTable'

export function MemoryAssignmentsTable({data}){
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return(
        <div className="table">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">DIRECCIÓN DE MEMORIA VIRTUAL</StyledTableCell>
                                <StyledTableCell align="center">PERMISOS</StyledTableCell>
                                <StyledTableCell align="center">DISPOSITIVO</StyledTableCell>
                                <StyledTableCell align="center">ARCHIVO</StyledTableCell>
                                <StyledTableCell align="center">RSS(Memoria Física)</StyledTableCell>
                                <StyledTableCell align="center">SIZE(Memoria Virtual)</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <StyledTableRow key={row.idData}>
                                            <TableCell align="center">{row.address}</TableCell>
                                            <TableCell align="center">{row.permissions}</TableCell>
                                            <TableCell align="center">{row.device}</TableCell>
                                            <TableCell align="center">{row.file}</TableCell>
                                            <TableCell align="center">{row.rss} MB</TableCell>
                                            <TableCell align="center">{row.size} MB</TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

        </div>   
    );
}