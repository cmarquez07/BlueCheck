import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/pages/Home'
import { LoginForm } from '../components/pages/LoginForm'
import { RegisterForm } from '../components/pages/RegisterForm'
import { BeachDetail } from '../components/pages/BeachDetail'
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