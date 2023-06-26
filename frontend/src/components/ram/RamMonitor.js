import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { RamTable } from "./RamTable";
import { getRamInformation } from '../../funciones/api';
import { RamGraph } from './RamGraph';

export function RamMonitor(){
    const [tableData, setTable] = useState([])
    const [usedRam, setUsedRam] = useState([])
    const [times, setTimes] = useState([])
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function getData(){
        var occupiedRam = [];
        var times = [];
        var date;

        while(true){
            const req = await getRamInformation();
            const res = await req.json();
        
            //Establecer valores de la tabla
            setTable([res]);

            //Establecer valores de uso de ram  y tiempos en la gráfica            
            if(occupiedRam.length == 10){
                occupiedRam.shift()
                times.shift()
            } 
            occupiedRam.push(res.percentage)
            date = new Date()
            times.push(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
            setTimes(times)
            setUsedRam(occupiedRam)

            await delay(3000);
        }  
    }

    useEffect(() => {
        getData();
    },[])

    return(
        <div className='ramMonitor'>

               <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                    Monitor de RAM
                </Typography>

                <RamTable  data={tableData}/>
                <RamGraph usedRam={usedRam} times={times}/>
        </div>
    )
}