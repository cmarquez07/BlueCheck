import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../Logo';
import toast from 'react-hot-toast';
import '../../styles/Auth.css';
import { useAuth } from '../../context/AuthContext'

const FORM_RULES = {
    identifier: [
        v => !v.trim() && "Debes indicar el nombre de usuario o el correo electrónico",
    ],
    password: [
        v => !v && "Debes indicar la contraseña",
    ]
};

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        identifier: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const update = (k) => (e) => {
        const value = e.target.value;
        setForm((f) => ({ ...f, [k]: value }));
        validateField(k, value);
    };

    const validateField = (key, value) => {
        let message = "";

        const validators = FORM_RULES[key];
        if (validators) {
            for (const test of validators) {
                const error = test(value);
                if (error) {
                    message = error;
                    break;
                }
            }
        }

        setErrors(prev => ({ ...prev, [key]: message }));
        return message === "";
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(form).forEach((key) => {
            validateField(key, form[key]) || (newErrors[key] = true);
        });
        return Object.values(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginPromise = fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "🚩Error en el inicio de sesión🚩");
            }

            login(data.token, data.user.id);
            return data;
        });

        toast.promise(loginPromise, {
            loading: "Iniciando sesión...",
            success: (data) => `¡Bienvenido, ${data.user.username}!🌊`,
            error: (err) => err.message || "🚩Error inesperado🚩"
        })
        .then(() => {
            setTimeout(() => navigate("/"), 800);
        }).catch(() => {})
    }

    
    return (
        <div className="w-90 lg:w-full max-w-xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-xl">
            <div id="branding" className="flex flex-col items-center">
                <Logo />
                <h1 className="text-2xl lg:text-4xl text-blue-500 font-bold text-kaushan">BlueCheck</h1>
            </div>
            <h2 className="text-4xl text-center font-bold text-blue-700 mt-6 mb-6 text-kaushan">Iniciar sesión</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Nombre de usuario o correo electrónico</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("identifier")}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
                    <input
                        type="password"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="••••••••"
                        onChange={update("password")}
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Iniciar sesión
                </button>
                <label className="block text-sm text-gray-600 mb-1 text-center">¿Aún no te has registrado? <Link to="/register" className="text-blue-700 underline">Crea una cuenta</Link></label>
                <p className="text-sm mt-[10px] text-center"></p>

            </form>
        </div>
    )
}