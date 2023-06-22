import './App.css';
import ProcesoCompu from './componentes/procesos';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Inicio from './componentes/inicio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/procesos' element={<ProcesoCompu />} />
      </Routes>
    </Router>

  );
}

export default App;
