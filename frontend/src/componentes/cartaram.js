import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getRamInformation }from '../funciones/api';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  } from "chart.js";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  )

export default function CartasRam() {

    const [tabla, setTabla] = useState([])
    const [usedRam, setUsedRam] = useState([])
    const [times, setTimes] = useState([])

    const graphData ={
        labels: times,
        datasets: [{
            label: 'Memoria RAM Utilizada',
            data: usedRam,
            backgroundColor: 'white',
            borderColor: 'green',
            pointBorderColor: 'green',
            fill: true,
        }]
    }

    const graphOptions = {
        responsive: true,
        plugins:{
            legend: true,
        },
        scales:{
            y: {
                min: 0,
                max: 100,
            }
        }
    }

   
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const data = async () => {
        var occupiedRam = [];
        var times = [];
        var date;
        while(true){
            const req = await getRamInformation();
            const res = await req.json();
           
            //Establecer valores de la tabla
            setTabla([res]);

            //Establecer valores de uso de ram  y tiempos en la gráfica            
            if(occupiedRam.length == 10){
                occupiedRam.shift()
                times.shift()
            } 
            occupiedRam.push(res.Percentage)
            date = new Date()
            times.push(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
            setTimes(times)
            setUsedRam(occupiedRam)

            await delay(3000);
        }     
    }

    useEffect(() => {
        data();
    },[])

    return (
        <>
            <div className="ram">
                <div className="ramTable">
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
                                    {tabla
                                        .map((row) => {
                                            return (
                                                <TableRow
                                                    key={row.idram}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">{row.Total} MB</TableCell>
                                                    <TableCell align="center">{row.Occupied} MB</TableCell>
                                                    <TableCell align="center">{row.Free} MB</TableCell>
                                                    <TableCell align="center">{row.Percentage}%</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>

                <div className="ramGraph">
                    <Line
                        data = {graphData}
                        options={graphOptions}
                    ></Line>
                </div>
            </div>
        </>
    );
}