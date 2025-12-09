import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import toast from 'react-hot-toast';
import '../../styles/Auth.css';

const FORM_RULES = {
    name: [
        v => !v.trim() && "El nombre es obligatorio",
        v => v.trim().length < 3 && "El nombre debe tener al menos 3 carácteres"
    ],
    username: [
        v => !v.trim() && "El nombre de usuario es obligatorio",
        v => v.trim().length < 3 && "El nombre de usuario debe tener al menos 3 carácteres"
    ],
    email: [
        v => !v && "El correo electrónico es obligatorio",
        v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && "El formato del correo electrónico no es válido"
    ],
    password: [
        v => !v && "La contraseña es obligatoria",
        v => v.length < 8 && "La contraseña debe tener al menos 8 carácteres",
        v => !/[A-Z]/.test(v) && "Debe contener al menos una letra mayúscula",
        v => !/[a-z]/.test(v) && "Debe contener al menos una letra minúscula",
        v => !/[0-9]/.test(v) && "Debe contener al menos un número",
        v => !/[!@#$%^&*(),.?":{}|<>_\-]/.test(v) && "Debe contener al menos un carácter especial"
    ]
};

export const RegisterForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const update = (k) => (e) => {
        const value = e.target.value;
        setForm((f) => ({ ...f, [k]: value }));
        validateField(k, value);
    };

    // Validaciones
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

        const formOk = validateForm();
        if (!formOk) {
            return;
        }

        const registerPromise = fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        }).then(async (res) => {
            const data = await res.json();
            
            if (!res.ok) {
                // Server or validation error
                throw new Error(data.message || "Error en el registro");
            }

            return data;
        })

        toast.promise(registerPromise, {
            loading: "Registrando usuario...",
            success: (data) => `🌊Usuario ${data.user.username} creado correctamennte🌊`,
            error: (err) => err.message || "🚩Error inesperado🚩"
        })
        .then(() => {
            setTimeout(() => navigate("/login"), 800);
        }).catch(() => {})
    }

    return (
        <div className="w-90 lg:w-full max-w-xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-xl">
            <div id="branding" className="flex flex-col items-center">
                <Logo />
                <h1 className="text-2xl lg:text-4xl text-[#007FD5] font-bold text-kaushan">BlueCheck</h1>
            </div>
            <h2 className="text-4xl text-center font-bold text-blue-700 mt-6 mb-6 text-kaushan">Crear una cuenta</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("email")}
                    />
                    {errors.email && <small className="text-red-500">{errors.email}</small>}
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Nombre de usuario</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("username")}
                    />
                    {errors.username && <small className="text-red-500">{errors.username}</small>}
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("name")}
                    />
                    {errors.name && <small className="text-red-500">{errors.name}</small>}
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
                    <input
                        type="password"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="••••••••"
                        onChange={update("password")}
                    />
                    {errors.password && <small className="text-red-500">{errors.password}</small>}
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    Registrarse
                </button>
            </form>
        </div>
    )
}