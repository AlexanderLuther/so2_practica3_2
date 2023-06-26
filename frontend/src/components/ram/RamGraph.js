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


export function RamGraph({times, usedRam}){
    
    const graphData ={
        labels: times,
        datasets: [{
            label: 'Memoria RAM Utilizada',
            data: usedRam,
            backgroundColor: 'white',
            borderColor: 'green',
            pointBorderColor: 'black',
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

    return(
        <div className="ramGraph">
                    <Line
                        data = {graphData}
                        options={graphOptions}
                    ></Line>
                </div>
    );
}