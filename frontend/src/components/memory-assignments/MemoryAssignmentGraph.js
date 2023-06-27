import { Card } from '../commons/Card'
import Typography from '@mui/material/Typography';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

export function MemoryAssignmentGraph({initialBlock=0, endBlock=0, residentMemory=0, virtualMemory=0}){

      const labels = ['Memoria'];
      const data = {
        labels: labels,
        datasets: [
            {
                stack:1,
                label: "Memoria Residente [MB]",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 1,
                data: [residentMemory],
              },
              {
                stack:1,
                label: "Memoria Virtual [MB]",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                data: [virtualMemory],
              },
            ]
        };

      const config = {
        type: 'bar',
        data: data,
      };

    return(
        <div>
            <div className='cardRowMap'> 
            <br></br>
                <Typography sx={{ mb: 2.5}} variant="h5" align='center' color="black">
                    Mapa de Memoria
                </Typography>
            </div>

            <div className="cardRowMap">
                <Card title="Bloque de Inicio" value={initialBlock} />
            </div>

            <div className="cardRowMap map">
                <Bar
                    data={data}
                    options={config}
                ></Bar>
            </div>
            
            <div className="cardRowMap">
                <Card title="Bloque de Fin" value={endBlock} />
            </div>
        </div>
    );
}