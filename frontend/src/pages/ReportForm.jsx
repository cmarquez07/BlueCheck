import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/Form.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const FORM_RULES = {
    waterStatus: [
        v => !v.trim() && "Selecciona una opción",
    ],
    waterCleanliness: [
        v => !v.trim() && "Selecciona una opción",
    ],
    beachCleanliness: [
        v => !v.trim() && "Selecciona una opción",
    ],
    peopleNumber: [
        v => !v.trim() && "Selecciona una opción",
    ],
    jellyfishPresence: [
        v => !v.trim() && "Selecciona una opción",
    ],
    flagColor: [
        v => !v.trim() && "Selecciona una opción",
    ]
};

export const ReportForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Recoger el token del AuthContext
    const { token } = useAuth();

    const [form, setForm] = useState({
        beachId: id,
        waterStatus: "",
        waterCleanliness: "",
        beachCleanliness: "",
        peopleNumber: "",
        jellyfishPresence: "",
        flagColor: "",
        comment: "",
        beachName: ""
    });

    const [errors, setErrors] = useState({});
    const [beach, setBeach] = useState([]);

    useEffect(() => {
        if (!token) {
            toast.error("🪼Debes iniciar sesión para enviar un reporte🪼");
            navigate("/");
        }

        const fetchBeach = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-beach/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setBeach(data);
            setForm((f) => ({
                ...f,
                beachName: data?.playa?.nombre || ""
            }))

            setLoading(false);
        };

        fetchBeach();
    }, [id]);


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

        setIsSubmitting(true);
        
        const reportPromise = fetch(`${import.meta.env.VITE_API_URL}/api/send-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(form)
        }).then(async (res) => {
            const data = await res.json();
            
            if (!res.ok) {
                // Server or validation error
                throw new Error(data.message || "Error en el envío del reporte");
            }

            return data;
        })

        toast.promise(reportPromise, {
            loading: "Enviando formulario...",
            success: (data) => `Formulario enviado correctamente correctamennte🌊`,
            error: (err) => err.message || "🚩Error inesperado🚩"
        })
        .then(() => {
            setTimeout(() => navigate(`/beach/${id}`), 800);
        }).catch(() => {})
    }

    return (
        <>
            <div id="report-form" className="flex flex-col justify-center items-center mt-[40px]">
                <div id="branding" className="flex flex-col items-center">
                    <h1 className="text-4xl text-[#007FD5] font-bold text-kaushan text-center">Enviar reporte para la playa "{beach?.playa?.nombre}"</h1>
                </div>
                <form className="w-[75%] lg:w-[20%] mt-[30px]" noValidate onSubmit={handleSubmit}>
                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="waterStatus">Estado del mar</InputLabel>
                                <Select
                                    labelId="waterStatus"
                                    id="waterStatusSelect"
                                    value={form.waterStatus}
                                    label="Estado del mar"
                                    onChange={update("waterStatus")}
                                >
                                    <MenuItem value="Calmado">Calmado</MenuItem>
                                    <MenuItem value="Moderado">Moderado</MenuItem>
                                    <MenuItem value="Revuelto">Revuelto</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.waterStatus && <small className="text-red-500">{errors.waterStatus}</small>}
                    </label>

                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="waterCleanliness">Limpieza del agua</InputLabel>
                                <Select
                                    labelId="waterCleanliness"
                                    id="waterCleanlinessSelect"
                                    value={form.waterCleanliness}
                                    label="Limpieza del agua"
                                    onChange={update("waterCleanliness")}
                                >
                                    <MenuItem value="Limpia">Limpia</MenuItem>
                                    <MenuItem value="Algunos residuos">Algunos residuos</MenuItem>
                                    <MenuItem value="Bastantes residuos">Bastantes residuos</MenuItem>
                                    <MenuItem value="Muchos residuos">Muchos residuos</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.waterCleanliness && <small className="text-red-500">{errors.waterCleanliness}</small>}
                    </label>

                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="beachCleanliness">Limpieza de la playa</InputLabel>
                                <Select
                                    labelId="beachCleanliness"
                                    id="beachCleanlinessSelect"
                                    value={form.beachCleanliness}
                                    label="Limpieza de la playa"
                                    onChange={update("beachCleanliness")}
                                >
                                    <MenuItem value="Limpia">Limpia</MenuItem>
                                    <MenuItem value="Algunos residuos">Algunos residuos</MenuItem>
                                    <MenuItem value="Bastantes residuos">Bastantes residuos</MenuItem>
                                    <MenuItem value="Muchos residuos">Muchos residuos</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.beachCleanliness && <small className="text-red-500">{errors.beachCleanliness}</small>}
                    </label>

                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="peopleNumber">Cantidad de gente</InputLabel>
                                <Select
                                    labelId="peopleNumber"
                                    id="peopleNumberSelect"
                                    value={form.peopleNumber}
                                    label="Cantidad de gente"
                                    onChange={update("peopleNumber")}
                                >
                                    <MenuItem value="Prácticamente vacía">Prácticamente vacía</MenuItem>
                                    <MenuItem value="Poca gente">Poca gente</MenuItem>
                                    <MenuItem value="Moderado">Moderado</MenuItem>
                                    <MenuItem value="Lleno">Lleno</MenuItem>
                                    <MenuItem value="Masificado">Masificado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.peopleNumber && <small className="text-red-500">{errors.peopleNumber}</small>}
                    </label>

                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="jellyfishPresence">Presencia de medusas</InputLabel>
                                <Select
                                    labelId="jellyfishPresence"
                                    id="jellyfishPresenceSelect"
                                    value={form.jellyfishPresence}
                                    label="Presencia de medusas"
                                    onChange={update("jellyfishPresence")}
                                >
                                    <MenuItem value="No">No</MenuItem>
                                    <MenuItem value="Algunas">Algunas</MenuItem>
                                    <MenuItem value="Muchas">Muchas</MenuItem>
                                    <MenuItem value="Plagado">Plagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.jellyfishPresence && <small className="text-red-500">{errors.jellyfishPresence}</small>}
                    </label>
                    <label className="flex flex-col mb-[10px]">
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="flagColor">Color de la bandera</InputLabel>
                                <Select
                                    labelId="flagColor"
                                    id="flagColorSelect"
                                    value={form.flagColor}
                                    label="Color de la bandera"
                                    onChange={update("flagColor")}
                                >
                                    <MenuItem value="Verde">Verde</MenuItem>
                                    <MenuItem value="Amarilla">Amarilla</MenuItem>
                                    <MenuItem value="Roja">Roja</MenuItem>
                                    <MenuItem value="Desconocido">Desconocido</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {errors.flagColor && <small className="text-red-500">{errors.flagColor}</small>}
                    </label>

                    <label className="flex flex-col mb-[10px]">
                        <span className="comment">Comentario</span>
                        <textarea name="comment" id="comment" className="pt-[16.5px] pl-[14px]" placeholder="Mensaje" onChange={update("comment")}></textarea>
                    </label>

                    <div className="flex flex-col justify-center mt-[20px]">
                        <button type="submit" disabled={isSubmitting} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] m-auto ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                            {isSubmitting ? "Enviando reporte..." : "Enviar reporte"}
                        </button>
                    </div>
                </form>
            </div>
            {loading && (
                <Loader />
            )}
        </>
    )
}