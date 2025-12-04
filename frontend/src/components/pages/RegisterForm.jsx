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
            headers: {
                "Content-Type": "application/json"
            },
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
        <div id="register-form" className="flex flex-col justify-center items-center mt-[40px]">
            <div id="branding" className="flex flex-col items-center">
                <Logo />
                <h1 className="text-4xl text-blue-500 font-bold text-kaushan">BlueCheck</h1>
            </div>
            <form className="w-[75%] lg:w-[20%] mt-[30px]" noValidate onSubmit={handleSubmit}>
                <label className="flex flex-col mb-[10px]">
                    <span>Nombre</span>
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="name"
                        value={form.name}
                        onChange={update("name")}
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                    />
                    {errors.name && <small className="text-red-500">{errors.name}</small>}
                </label>

                <label className="flex flex-col mb-[10px]">
                    <span>Nombre de usuario</span>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        name="username"
                        value={form.username}
                        onChange={update("username")}
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                    />
                    {errors.username && <small className="text-red-500">{errors.username}</small>}
                </label>

                 <label className="flex flex-col mb-[10px]">
                    <span>Correo electrónico</span>
                    <input
                        type="text"
                        placeholder="Correo electrónico"
                        name="email"
                        value={form.email}
                        onChange={update("email")}
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                    />
                    {errors.email && <small className="text-red-500">{errors.email}</small>}
                </label>

                 <label className="flex flex-col mb-[10px]">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={update("password")}
                        className="border border-blue-500 rounded-md pl-[10px] pr-[10px] p-[2px]"
                    />
                    {errors.password && <small className="text-red-500">{errors.password}</small>}
                </label>

                <div className="flex flex-col justify-center mt-[20px]">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] m-auto" data-testid="submit">
                        Registrarse
                    </button>
                    <p className="text-sm mt-[10px] text-center">¿Ya tienes una cuenta? <Link to="/login" className="text-blue-700 underline">Inicia sesión</Link></p>
                </div>
            </form>
        </div>
    )
}