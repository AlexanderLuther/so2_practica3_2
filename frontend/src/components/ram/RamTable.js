import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function RamTable({data}){
    return(
        <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">TOTAL</TableCell>
                                <TableCell align="center">EN USO</TableCell>
                                <TableCell align="center">LIBRE</TableCell>
                                <TableCell align="center">PORCENTAJE UTILIZADO</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .map((row) => {
                                    return (
                                        <TableRow
                                            key={row.idram}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{row.total} MB</TableCell>
                                            <TableCell align="center">{row.occupied} MB</TableCell>
                                            <TableCell align="center">{row.free} MB</TableCell>
                                            <TableCell align="center">{row.percentage}%</TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}