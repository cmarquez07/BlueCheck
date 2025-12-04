import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'
import '../styles/Form.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export const ReportForm = () => {
    const { isLoggedIn, userId } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("🪼Debes iniciar sesión para enviar un reporte🪼");
            navigate("/");
        }
    },[])
    
    const { id } = useParams();
    const [beach, setBeach] = useState([]);

    useEffect(() => {
        const fetchBeach = async () => {
            const response = await fetch(`http://localhost/api/get-beach/${id}`);
            const data = await response.json();
            setBeach(data);
        };

        fetchBeach();
    }, [id]);


    const [form, setForm] = useState({
        beachId: id,
        userId: userId,
        waterStatus: "",
        waterCleanliness: "",
        beachCleanliness: "",
        peopleNumber: "",
        jellyfishPresence: "",
        flagColor: "",
        comment: ""
    });

    const update = (k) => (e) => {
        const value = e.target.value;
        setForm((f) => ({ ...f, [k]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const reportPromise = fetch(`${import.meta.env.VITE_API_URL}/api/send-report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        <div id="report-form" className="flex flex-col justify-center items-center mt-[40px]">
            <div id="branding" className="flex flex-col items-center">
                <h1 className="text-4xl text-blue-500 font-bold text-kaushan text-center">Enviar reporte para la playa "{beach?.playa?.nombre}"</h1>
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
                </label>

                <label className="flex flex-col mb-[10px]">
                    <span className="comment">Comentario</span>
                    <textarea name="comment" id="comment" className="pt-[16.5px] pl-[14px]" placeholder="Mensaje" onChange={update("comment")}></textarea>
                </label>

                <div className="flex flex-col justify-center mt-[20px]">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] m-auto" data-testid="submit">
                        Enviar reporte
                    </button>
                </div>
            </form>
        </div>
    )
}