import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/Home'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
        </Routes>
    )
}