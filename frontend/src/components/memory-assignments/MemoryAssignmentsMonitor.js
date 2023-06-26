import Typography from '@mui/material/Typography';
import { MemoryAssignmentsTable } from '../memory-assignments/MemoryAssignmentsTable'
import { AssignmentsInformation } from './AssignmentsInformation';


export function MemoryAssignmentsMonitor({assignments, rss, size, totalRam, name}){
    var percentage = (rss*100)/totalRam
    if(isNaN(percentage)) {
        percentage = 0
    }
    
    return(
        <div className="memory-monitor">
            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Monitor de Asignación de Memoria {name}
            </Typography>

            <AssignmentsInformation rss={rss} size={size} percentage={percentage.toFixed(2)} />

            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Tabla Asignaciones de Memoria
            </Typography>
            <MemoryAssignmentsTable data={assignments}/>

        </div>
    );
}