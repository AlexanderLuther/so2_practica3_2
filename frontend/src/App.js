import '../src/App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Monitor } from './components/Home/Monitor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Monitor />} />
      </Routes>
    </Router>

  );
}

export default App;
