import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { ProcessesInformation } from './ProcessesInformation';
import { getCpuProcesses } from '../../funciones/api';
import { ProcessesTable } from './ProcessesTable';

export function CpuMonitor(){
    const [processes, setTotalProcesses] = useState(0)
    const [running, setRunning] = useState(0)
    const [sleeping, setSleeping] = useState(0)
    const [stopped, setStopped] = useState(0)
    const [zombie, setZombie] = useState(0)
    const [processesTable, setProcessesTable] = useState([])
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function getData() {
        while(true){
            const req = await getCpuProcesses();
            const res = await req.json();

            //Establecer información de los procesos
            setTotalProcesses(res.totalProcesses);
            setRunning(res.totalRunning);
            setSleeping(res.totalSleeping);
            setStopped(res.totalStopped);
            setZombie(res.totalZombie);

            //Establecer información de la tabla de procesos
            setProcessesTable(res.root)
            await delay(5000);
        }  
    }

    useEffect(() => {
        getData()
    }, [])
    
    return(
        <div className="cpuMonitor">

            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Monitor de Procesos
            </Typography>

            <ProcessesInformation totalAmount={processes} runningAmount={running} sleepingAmount={sleeping} stoppedAmount={stopped} zombieAmount={zombie} />

            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Tabla de Procesos
            </Typography>

            <ProcessesTable data={processesTable}/>

        </div>
    );

}