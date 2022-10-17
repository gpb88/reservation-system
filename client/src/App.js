import Login from 'routes/Login';
import Home from 'routes/Home';
import Authorize from 'routes/Authorize';
import { Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <Routes>
            <Route exact path='/' element={<Login />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/googleauth' element={<Authorize />} />
        </Routes>
    );
}
