import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'
import SearchPage from './SearchPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </Router>
    );
}

export default App;
