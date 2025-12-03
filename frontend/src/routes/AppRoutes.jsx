import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/Home'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { BeachDetail } from '../components/BeachDetail'
import { ReportForm } from '../components/ReportForm'


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/beach/:id" element={<BeachDetail />}/>
            <Route path="/beach/:id/sendreport" element={<ReportForm />}/>
        </Routes>
    )
}