import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getCpuProcesses } from '../funciones/api';
import { killProcess } from '../funciones/api';
import { getMemoryAssignments } from '../funciones/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function TablaCPU() {
    const [processes, setTotalProcesses] = useState([])
    const [running, setRunning] = useState("")
    const [sleeping, setSleeping] = useState("")
    const [stopped, setStopped] = useState("")
    const [zombie, setZombie] = useState("")

    const [tablaCpu, setTablaCpu] = useState([])
    const [hijos, setChildren] = useState([])
    const [assignments, setAssignments] = useState([])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [page1, setPage1] = React.useState(0);
    const [rowsPerPage1, setRowsPerPage1] = React.useState(10);

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage);
    };

    const handleChangeRowsPerPage1 = (event) => {
        setRowsPerPage1(+event.target.value);
        setPage1(0);
    };

    const [assignmentPage, setAssignmentPage] = React.useState(0);
    const [assignmentRowsPerPage, setAssignmentRowsPerPage] = React.useState(10);

    const assignmentHandleChangePage = (event, newPage) => {
        setAssignmentPage(newPage);
    };

    const assignmentHandleChangeRowsPerPage = (event) => {
        setAssignmentRowsPerPage(+event.target.value);
        setAssignmentPage(0);
    };

    const cardProcesos = (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    PROCESOS
                </Typography>
                <Typography variant="h4" color="black">
                    {processes}
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    const cardEjecutados = (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    EJECUTANDO
                </Typography>
                <Typography variant="h4" color="black">
                    {running}
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    const cardDormidos = (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    DORMIDOS
                </Typography>
                <Typography variant="h4" color="black">
                    {sleeping}
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    const cardDetenidos = (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    DETENIDOS
                </Typography>
                <Typography variant="h4" color="black">
                    {stopped}
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    const cardZombie = (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    ZOMBIE
                </Typography>
                <Typography variant="h4" color="black">
                    {zombie}
                </Typography>
            </CardContent>
        </React.Fragment>
    );

    useEffect(() => {
        getProcesses()
    }, [])

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function getProcesses() {
        while(true){
            const req = await getCpuProcesses();
            const res = await req.json();
            setProcessesGeneralInfo(res.root)
            setTablaCpu(res.root)
           await delay(5000);
        }  
    }

    async function setProcessesGeneralInfo(processes){
        var runningProcesses = 0;
        var sleepingProcesses = 0;
        var stoppedProcesses = 0;
        var zombieProcesses = 0;
        var totalProcesses = 0;

        processes.forEach(process => {
            if(process.State === "Sleeping"){
                    sleepingProcesses++;
            } else if(process.State === "Zombie"){
                    zombieProcesses++;
            }else if(process.State === "Stopped"){
                    stoppedProcesses++;
            } else if(process.State === "Running"){
                runningProcesses++;
            }

            if(process.Children.length > 0){
                process.Children.forEach(childProcess => {
                    if(childProcess.State === "Sleeping"){
                            sleepingProcesses++;
                    } else if(childProcess.State === "Zombie"){
                            zombieProcesses++;
                    }else if(childProcess.State === "Stopped"){
                            stoppedProcesses++;
                    } else if(childProcess.State === "Running"){
                        runningProcesses++;
                    }
                    totalProcesses++;
                })
            }
           totalProcesses++;
        })

        setTotalProcesses(totalProcesses);
        setZombie(zombieProcesses);
        setStopped(stoppedProcesses);
        setSleeping(sleepingProcesses);
        setRunning(runningProcesses);
    }

    async function kill(id) {
        var req = await killProcess(id);
        var res = await req.json();
        toast.success(res, {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    async function setMemoryAssignments(id) {
        const req = await getMemoryAssignments(id);
        const res = await req.json();
        if(res == ''){
            toast.info("Proceso sin asignaciones de memoria", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else{
            toast.success("Asignaciones obtenidas, ver tabla de asignaciones.", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setAssignments(res)
    }

    return (
        <>
        <div className='cpu'>
            <div className="cards">
                <div className="card">
                        <Box sx={{backgroundColor: 'rgb(118, 250, 206)' }}>
                            <Card variant="outlined">{cardProcesos}</Card>
                        </Box>
                    </div>

                    <div className="card">
                        <Box sx={{backgroundColor: 'rgb(118, 250, 206)' }}>
                            <Card variant="outlined">{cardEjecutados}</Card>
                        </Box>
                    </div>

                    <div className="card">
                        <Box sx={{backgroundColor: 'rgb(118, 250, 206)' }}>
                            <Card variant="outlined">{cardDormidos}</Card>
                        </Box>
                    </div>

                    <div className="card">
                        <Box sx={{backgroundColor: 'rgb(118, 250, 206)' }}>
                            <Card variant="outlined">{cardDetenidos}</Card>
                        </Box>
                    </div>

                    <div className="card">
                        <Box sx={{backgroundColor: 'rgb(118, 250, 206)' }}>
                            <Card variant="outlined">{cardZombie}</Card>
                        </Box>
                    </div>
            </div>
                
                 <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                    Tabla de Procesos
                </Typography>
                <div className="table1">
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
                                    {tablaCpu
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <StyledTableRow
                                                    key={row.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">{row.PID}</TableCell>
                                                    <TableCell align="center">{row.Process}</TableCell>
                                                    <TableCell align="center">{row.State}</TableCell>
                                                    <TableCell align="center">{row.RAM} MB</TableCell>
                                                    <TableCell align="center">{row.User}</TableCell>
                                                    <TableCell align="center">
                                                        {row.hijos}  
                                                        {row.Children.length > 0 
                                                            ?<>
                                                                <Button onClick={() => setChildren(row.Children)}>+</Button>
                                                                <Button onClick={() => setChildren([])}>-</Button>
                                                            </> 
                                                            :<label>Sin hijos</label>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button onClick={() => kill(row.PID)}>Kill</Button>
                                                        <Button onClick={() => setMemoryAssignments(row.PID)}>Asignaciones de Memoria</Button>
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
                            count={tablaCpu.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>

                <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                    Tabla de Procesos Hijos
                </Typography>
                <div className="Tabla2">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">PID</StyledTableCell>
                                        <StyledTableCell align="center">PROCESO</StyledTableCell>
                                        <StyledTableCell align="center">ESTADO</StyledTableCell>
                                        <StyledTableCell align="center">ACCIONES</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hijos
                                        .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                                        .map((row) => {
                                            return (
                                                <StyledTableRow key={row.idhijo}>
                                                    <TableCell align="center">{row.PID}</TableCell>
                                                    <TableCell align="center">{row.Process}</TableCell>
                                                    <TableCell align="center">{row.State}</TableCell>
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
                            count={hijos.length}
                            rowsPerPage={rowsPerPage1}
                            page={page1}
                            onPageChange={handleChangePage1}
                            onRowsPerPageChange={handleChangeRowsPerPage1}
                        />
                    </Paper>

                </div> 
                <br></br>
                <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                    Tabla de Asignaciones de Memoria
                </Typography>
                <div className="Tabla3">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">DIRECCIÓN DE MEMORIA VIRTUAL</StyledTableCell>
                                        <StyledTableCell align="center">TAMAÑO</StyledTableCell>
                                        <StyledTableCell align="center">PERMISOS</StyledTableCell>
                                        <StyledTableCell align="center">DISPOSITIVO</StyledTableCell>
                                        <StyledTableCell align="center">ARCHIVO</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignments
                                        .slice(assignmentPage * assignmentRowsPerPage, assignmentPage * assignmentRowsPerPage + assignmentRowsPerPage)
                                        .map((row) => {
                                            return (
                                                <StyledTableRow key={row.idassignment}>
                                                    <TableCell align="center">{row.address}</TableCell>
                                                    <TableCell align="center">{row.size}</TableCell>
                                                    <TableCell align="center">{row.permisions}</TableCell>
                                                    <TableCell align="center">{row.device}</TableCell>
                                                    <TableCell align="center">{row.file}</TableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={assignments.length}
                            rowsPerPage={assignmentRowsPerPage}
                            page={assignmentPage}
                            onPageChange={assignmentHandleChangePage}
                            onRowsPerPageChange={assignmentHandleChangeRowsPerPage}
                        />
                    </Paper>

                </div>                         
                <br></br>
                <ToastContainer />
        </div>
        </>
    );
}