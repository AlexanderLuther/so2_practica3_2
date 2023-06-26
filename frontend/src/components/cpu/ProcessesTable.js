import * as React from 'react';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import 'react-toastify/dist/ReactToastify.css';
import { StyledTableCell } from '../commons/StyledTable' 
import { StyledTableRow } from '../commons/StyledTable'
import { killProcess } from '../../funciones/api';
import { getMemoryAssignments } from '../../funciones/api';
import { getRamInformation } from '../../funciones/api';
import { ChildrenTable } from './ChildrenTable';
import { MemoryAssignmentsMonitor } from '../memory-assignments/MemoryAssignmentsMonitor';

export function ProcessesTable({data}){
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [children, setChildren] = useState([])
    const [assignments, setAssignments] = useState([])
    const [rss, setRss] = useState(0)
    const [size, setSize] = useState(0)
    const [totalRam, setTotalRam] = useState(0)
    const [processNameChildren, setProcessNameChildren] = useState("")
    const [processNameMemory, setProcessNameMemory] = useState("")
    
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

    async function setMemoryAssignments(id, name) {
        toast.info("Obteniendo asignaciones de memoria", {
            position: toast.POSITION.TOP_RIGHT
        });
        const req = await getMemoryAssignments(id);
        const res = await req.json();

        if(res.assignments == null || res.assignments == ''){
            setRss(0)
            setSize(0)
            setAssignments([])
            setTotalRam(0)
            setProcessNameMemory("")
            toast.warning("Proceso sin asignaciones de memoria", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else{
            setProcessNameMemory("["+name+"]")
            setAssignments(res.assignments)
            setRss(res.residentMemory)
            setSize(res.virtualMemory)
            getTotalRam()
            toast.success("Asignaciones obtenidas, ver tabla de asignaciones.", {
                position: toast.POSITION.TOP_RIGHT
            });
        
        }  
    }

    async function getTotalRam(){
        const req = await getRamInformation();
        const res = await req.json();
        setTotalRam(res.total);
    }

    function setChildrenTable(children, processName){
        setChildren(children) 
        setProcessNameChildren("["+processName+"]")
    }

    function clearChildrenTable(){
        setChildren([]) 
        setProcessNameChildren("")
    }

    return(
        <div className='processes'>
            <div className='table'>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">PID</StyledTableCell>
                                    <StyledTableCell align="center">NAME</StyledTableCell>
                                    <StyledTableCell align="center">ESTADO</StyledTableCell>
                                    <StyledTableCell align="center">RAM</StyledTableCell>
                                    <StyledTableCell align="center">USER</StyledTableCell>
                                    <StyledTableCell align="center">HIJOS</StyledTableCell>
                                    <StyledTableCell align="center">ACCIONES</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <StyledTableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{row.pid}</TableCell>
                                                <TableCell align="center">{row.process}</TableCell>
                                                <TableCell align="center">{row.state}</TableCell>
                                                <TableCell align="center">{row.ram} MB</TableCell>
                                                <TableCell align="center">{row.user}</TableCell>
                                                <TableCell align="center">
                                                    {row.hijos}  
                                                    {row.children.length > 0 
                                                        ?<>
                                                            <Button onClick={() => setChildrenTable(row.children, row.process) }>+</Button>
                                                            <Button onClick={() => clearChildrenTable()}>-</Button>
                                                        </> 
                                                        :<label>Sin hijos</label>
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button onClick={() => kill(row.pid)}>Kill</Button>
                                                    <Button onClick={() => setMemoryAssignments(row.pid, row.process)}>Asignaciones de Memoria</Button>
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
            
            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Tabla de Procesos Hijos {processNameChildren}
            </Typography>
            <ChildrenTable data={children}/>
            
            <MemoryAssignmentsMonitor assignments={assignments} rss={rss} size={size} totalRam={totalRam} name={processNameMemory}/>
           
        </div>

    );
}