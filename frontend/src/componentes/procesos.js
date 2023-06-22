import '../App.css';
import CartasRam from './cartaram';
import TablaCPU from './tablacpu';
import Typography from '@mui/material/Typography';

function Procesos() {
  return (

    <>
      <div className="app">
        <div className="tittle">
          <Typography variant="h3" gutterBottom sx={{ color: "#006E4E" }}>
            PRACTICA 3
          </Typography>
        </div>

        <div className="ramInfo">
          <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
            Monitor de RAM
          </Typography>
          <CartasRam />
        </div>

        <div className="cpuInfo">
          <Typography variant="h4" gutterBottom sx={{ color: "#006E4E" }}>
            Monitor de Procesos
          </Typography>
          <TablaCPU />
        </div>

      </div>
    </>
  );
}

export default Procesos;
