import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import toast from 'react-hot-toast';
import '../styles/Auth.css';
import { useAuth } from '../context/AuthContext'

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

        const loginPromise = fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "🚩Error en el inicio de sesión🚩");
            }

            login(data.token);
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
        <div id="register-form" className="flex flex-col justify-center items-center">
            <div id="branding" className="flex flex-col items-center">
                <Logo />
                <h1 className="text-4xl text-blue-500 font-bold text-kaushan">BlueCheck</h1>
            </div>
            <form className="w-[75%] lg:w-[20%] mt-[30px]" noValidate onSubmit={handleSubmit}>
                <label className="flex flex-col mb-[10px]">
                    <span>Nombre de usuario o contraseña</span>
                    <input
                        type="text"
                        placeholder="Nombre de usuario o contraseña"
                        name="identifier"
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                        onChange={update("identifier")}
                    />
                </label>

                <label className="flex flex-col mb-[10px]">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                        onChange={update("password")}
                    />
                </label>

                <div className="flex flex-col justify-center mt-[20px]">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] m-auto" data-testid="submit">
                        Iniciar sesión
                    </button>
                    <p className="text-sm mt-[10px] text-center">Aún no te has registrado? <Link to="/register" className="text-blue-700 underline">Crea una cuenta</Link></p>
                </div>
            </form>
        </div>
    )
}