import { useState } from 'react';
import "../styles/Form.css";
import { Logo } from '../components/Logo';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const FORM_RULES = {
    name: [
        v => !v.trim() && "Debes indicar el nombre de usuario o el correo electrónico",
    ],
    email: [
        v => !v && "El correo electrónico es obligatorio",
        v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && "El formato del correo electrónico no es válido"
    ],
    comment: [
        v => !v.trim() && "Debes indicar un mensaje",
    ]
};

export const ContactForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        comment: ""
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

        setIsSubmitting(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (data) {
            toast.success("🌊Formulario enviado correctamente🌊");
            setTimeout(() => navigate("/"), 800);
        }
    }

    return (
        <div className="w-90 lg:w-full max-w-xl mx-auto mt-2 p-6 bg-white shadow-lg rounded-xl">
            <div id="branding" className="flex flex-col items-center">
                <Logo />
                <h1 className="text-2xl lg:text-4xl text-[#007FD5] font-bold text-kaushan">BlueCheck</h1>
            </div>
            <h2 className="text-4xl text-center font-bold text-blue-700 mt-6 mb-6 text-kaushan">Formulario de contacto</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div>
                    <label className="block text-sm text-gray-600 mb-1" htmlFor="name">Nombre completo</label>
                    <input
                        id="name"
                        type="text"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("name")}
                    />
                    {errors.name && <small className="text-red-500">{errors.name}</small>}
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={update("email")}
                    />
                    {errors.email && <small className="text-red-500">{errors.email}</small>}
                </div>

                <label className="flex flex-col mb-[10px]">
                    <span className="comment">Comentario</span>
                    <textarea name="comment" id="comment" className="pt-[16.5px] pl-[14px]" placeholder="Mensaje" onChange={update("comment")}></textarea>
                    {errors.comment && <small className="text-red-500">{errors.comment}</small>}
                </label>

                <button type="submit" disabled={isSubmitting} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] m-auto ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                    {isSubmitting ? "Enviando mensaje..." : "Enviar"}
                </button>

            </form>
        </div>
    )
}