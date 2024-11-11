
import './App.css';
import Header from './components/Header';
import Signup from './pages/Signup' ;
import Dashboard from './pages/Dashboard' ;
import { BrowserRouter as Router ,  Route , Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//react creates a single page application(SPA) automatically using react router dom
function App() {
  return (
    <>
    <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/dashboard" element = {<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
