import '../../App.css';
import { CpuMonitor } from '../cpu/CpuMonitor';
import { RamMonitor } from './../ram/RamMonitor';
import Typography from '@mui/material/Typography';
import { ToastContainer } from 'react-toastify';

export function Monitor() {
  return (
      <div className="app">

        <div className="title">
          <Typography variant="h3" gutterBottom sx={{ color: "#006E4E" }}>
            PRACTICA 3
          </Typography>
        </div>

        <RamMonitor />
        <CpuMonitor/>
        <ToastContainer/>
      </div>
  );
}