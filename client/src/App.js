import Login from 'routes/Login';
import Home from 'routes/Home';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from 'services/privateRoute';

export default function App() {
    return (
        <Routes>
            <Route exact path='/' element={<Login />} />
            <Route exact path='/home' element={<Home />} />
        </Routes>
    );
}
