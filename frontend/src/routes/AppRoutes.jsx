import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { LoginForm } from '../pages/LoginForm'
import { RegisterForm } from '../pages/RegisterForm'
import { BeachDetail } from '../pages/BeachDetail'
import { ReportForm } from '../pages/ReportForm'
import { UserPage } from '../pages/UserPage'
import { ContactForm } from '../pages/ContactForm'
import { DataUsage } from '../pages/DataUsage'


export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/beach/:id" element={<BeachDetail />}/>
            <Route path="/beach/:id/sendreport" element={<ReportForm />}/>
            <Route path="/user" element={<UserPage />}/>
            <Route path="/contact" element={<ContactForm/>} />
            <Route path="/data-usage" element={<DataUsage/>} />
        </Routes>
    )
}