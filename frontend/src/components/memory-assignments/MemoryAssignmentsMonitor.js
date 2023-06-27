import Typography from '@mui/material/Typography';
import { MemoryAssignmentsTable } from '../memory-assignments/MemoryAssignmentsTable'
import { AssignmentsInformation } from './AssignmentsInformation';
import { MemoryAssignmentGraph } from './MemoryAssignmentGraph';


export function MemoryAssignmentsMonitor({assignments, rss, size, totalRam, name}){
    var percentage = (rss*100)/totalRam
    var initialBlock;
    var endBlock;
    if(isNaN(percentage)) {
        percentage = 0
    }

    
    if(assignments != ''){
        initialBlock = (assignments[0].address).split('-')[0];
        endBlock= (assignments[assignments.length -1].address).split('-')[1];
    }
    
    return(
        <div className="memory-monitor">
            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Monitor de Asignación de Memoria {name}
            </Typography>

            <div className='memory-assignment-information' >
                <AssignmentsInformation rss={rss} size={size} percentage={percentage.toFixed(2)} />
                <MemoryAssignmentGraph initialBlock={initialBlock} endBlock={endBlock} residentMemory={rss} virtualMemory={size}/>
            </div>
            <br></br>
            <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
                Tabla Asignaciones de Memoria
            </Typography>
            <MemoryAssignmentsTable data={assignments}/>

        </div>
    );
}