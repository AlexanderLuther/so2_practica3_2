import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { StyledTableCell } from '../commons/StyledTable' 
import { StyledTableRow } from '../commons/StyledTable'
import { killProcess } from '../../funciones/api';

export function ChildrenTable({data}){
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function kill(id) {
        var req = await killProcess(id);
        var res = await req.json();
        toast.success(res, {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    return(
        <div className='table'>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">PID</StyledTableCell>
                                <StyledTableCell align="center">PROCESO</StyledTableCell>
                                <StyledTableCell align="center">ESTADO</StyledTableCell>
                                <StyledTableCell align="center">ACCIONES</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <StyledTableRow key={row.idhijo}>
                                            <TableCell align="center">{row.pid}</TableCell>
                                            <TableCell align="center">{row.process}</TableCell>
                                            <TableCell align="center">{row.state}</TableCell>
                                            <TableCell align="center">
                                                <Button onClick={() => kill(row.PID)}>Kill</Button>
                                            </TableCell>
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