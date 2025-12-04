import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import { Icon } from "../icons/Icon";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';

// Funcines de componentes
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// Función para obtener la orientación cardinal a partir de los grados
function direction(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

    const index = Math.round(degrees / 45) % 8;

    return directions[index];
}


export const BeachDetail = () => {
    const { id } = useParams();
    const [beach, setBeach] = useState([]);
    const [reports, setReports] = useState([]);
    
    // Estado para el componente de las Tabs
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchBeach = async () => {
            const response = await fetch(`http://localhost/api/get-beach/${id}`);
            const data = await response.json();
            setBeach(data);
        };

        const fetchReports = async () => {
            const response = await fetch(`http://localhost/api/get-beach-reports/${id}`);
            const data = await response.json();
            setReports(data);
        };

        fetchBeach();
        fetchReports();
    }, [id]);

    const flagBadge = (color) => {
        const map = {
            Verde: "bg-green-500",
            Amarilla: "bg-yellow-400",
            Roja: "bg-red-500",
            default: "bg-gray-400"
        };

        return map[color] || map.default;
    }

    // Debugging, ELIMINAR CUANDO ESTE LISTO
    useEffect(() => {
        console.log("Reportes actualizado:", reports);
    }, [reports]);
    return (
        <>
            <div id='beach-header' 
            className='w-full flex flex-col justify-end h-[35vh] p-[20px] relative bg-cover bg-no-repeat' 
            style={{
                backgroundImage: `
                  linear-gradient(
                        to top,
                        rgba(0, 0, 0, 1),
                        rgba(0, 0, 0, 0)
                    ),
                 url(https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/uploads/fotos/${beach?.playa?.imatgesPlatja?.[0]?.url})`,
            }}>
                <h1 className="text-4xl text-blue-500 font-bold text-kaushan mb-[10px]">{beach?.playa?.nombre}</h1>
                <h2 className="text-2xl text-blue-500 font-bold text-kaushan mb-[10px]">{beach?.playa?.municipio}</h2>
                <p className='text-xs text-white'>
                    {beach?.playa?.descripcioPlatja}
                </p>
                <div className="absolute top-[0] right-[0]">
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Fab color="primary" aria-label="add" size="small">
                            <Link to={`/beach/${beach?.playa?.id}/sendreport`}><AddIcon /></Link>
                        </Fab>
                        <Fab aria-label="like" size="small">
                            <FavoriteIcon />
                        </Fab>
                    </Box>
                </div>
            </div>

            <div id="beach-icons" className="h-auto bg-gray-200 flex pt-[10px] pb-[10px]">
                {beach?.tiempo?.estadoCielo && (
                <div className="w-1/4 p-[10px] text-xs flex flex-col items-center justify-start text-center">
                    <Icon src={beach?.tiempo?.estadoCielo?.icon} width="w-[30px]" height="w-[30px]" alt={beach?.tiempo?.estadoCielo?.text}/>
                    <p className="pt-[10px]">{beach?.tiempo?.temperatura} ºC</p>
                </div>
                )}
                {beach?.tiempo && (
                    <div className="w-1/4 p-[10px] text-xs flex flex-col items-center justify-start text-center">
                        <Icon src="waterTermometer.png" width="w-[30px]" height="w-[30px]" alt="Temperatura del agua"/>
                        <div className="pt-[10px]">
                            <p>Temperatura del agua:</p>
                            <p>{beach?.tiempo?.temperaturaAgua} ºC</p>
                        </div>
                         
                    </div>
                )}
                {beach?.calidadPlaya &&(
                <div className="w-1/4 p-[10px] text-xs flex flex-col items-center justify-start text-center">
                    <Icon src="flag.png" filter={beach?.tiempo?.estadoAgua?.color} width="w-[30px]" height="w-[30px]" alt={beach?.tiempo?.estadoAgua?.text}/>
                    <p className="pt-[10px]">{beach?.tiempo?.estadoAgua?.text}</p>
                </div>
                )}
                {beach?.medusas &&(
                <div className="w-1/4 p-[10px] text-xs flex flex-col items-center justify-start text-center">
                    <Icon src="jellyfish.png" filter={beach?.medusas?.color} width="w-[30px]" height="w-[30px]" alt={beach?.medusas?.text}/>
                    <p className="pt-[10px]">{beach?.medusas?.text}</p>
                </div>
                )}
            </div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="Pestañas de información">
                        <Tab label="Información oficial" {...a11yProps(0)} />
                        <Tab label="Reportes de usuarios" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography component="span">Características de la playa</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul>
                                    <li className="mb-[5px]"><i className="fa-solid fa-umbrella-beach"></i> Tipo de playa: {beach?.playa?.caracteristicasFisicas?.tipoplaya} </li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-grip"></i> Tipo de arena: {beach?.playa?.caracteristicasFisicas?.tipoarena} </li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-seedling"></i> Entorno: {beach?.playa?.caracteristicasFisicas?.entorno} </li>
                                    <li className="mb-[5px]"><i className="fa-regular fa-life-ring"></i> Socorrismo: {beach?.playa?.caracteristicasFisicas?.socorrismo} </li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <Typography component="span">Estado del agua</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul>
                                    <li className="flex items-center gap-[9px] mb-[5px]"><Icon src="jellyfish.png" filter={beach?.medusas?.color} width="w-[15px]" height="h-[15px]" alt="Estado del las medusas"/>{beach?.medusas?.text}</li>
                                    <li className="flex items-center gap-[9px] mb-[5px]"><Icon src="flag.png" filter={beach?.medusas?.color} width="w-[15px]" height="h-[15px]" alt="Estado del las medusas"/>{beach?.tiempo?.estadoAgua?.text}</li>
                                    <li className="flex items-center gap-[9px] mb-[5px]"><Icon src="waterTermometer.png" width="w-[15px]" height="w-[15px]" alt="Temperatura del agua"/>Temperatura del agua: {beach?.tiempo?.temperaturaAgua}ºC</li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-up-long"></i> Altura de las olas: {beach?.estadoMar?.alturaolas} m </li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-water"></i> Dirección de las olas: {direction(beach?.estadoMar?.direccionolas)} </li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-compass"></i> Dirección del viento: {direction(beach?.estadoMar?.direccionviento)}</li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-wind"></i> Velocidad del viento: {beach?.estadoMar?.velocidadviento} m/s</li>
                                    <li className="mb-[5px]"><i className="fa-regular fa-sun"></i> Índice UV: : {beach?.playa?.caracteristicasFisicas?.entorno} </li>
                                    <li className="mb-[5px]"><i className="fa-regular fa-sun"></i> Índice UV máxima radiación: {beach?.playa?.caracteristicasFisicas?.entorno} </li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <Typography component="span">Tiempo previsto</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul>
                                    <li className="flex items-center gap-[9px] mb-[5px]"><Icon src={beach?.tiempo?.estadoCielo?.icon} width="w-[20px]" height="w-[20px]" alt={beach?.tiempo?.estadoCielo?.text}/>{beach?.tiempo?.traduccionCielo}</li>
                                    <li className="mb-[5px]"><i className="fa-solid fa-temperature-full"></i> Temperatura: {beach?.tiempo?.temperatura} ºC </li>
                                </ul>
                                
                                
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    {reports.map((report) => (
                        <article className="max-w-md w-full bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-800">Reporte de {report.username}</h3>
                                    <p className="text-sm text-slate-500 mt-1">Observaciones del usuario sobre el estado de la playa a fecha de: {new Date(report.created_at).toLocaleString("es-ES", {
                                            dateStyle: "short",
                                            timeStyle: "short"
                                        })}</p>
                                </div>

                                {/* Flag color badge */}
                                <div className="ml-4 flex items-center">
                                    <span
                                        className={`inline-block w-10 h-6 rounded-md ${flagBadge(report.flag_color)} shadow-sm`}
                                        title={`Bandera: ${report.flag_color}`}
                                        aria-label={`Bandera: ${report.flag_color}`}
                                    />
                                </div>
                            </div>

                            <dl className="mt-4 grid grid-cols-1 gap-y-3 text-sm text-slate-700">
                                <div className="flex justify-between">
                                    <dt className="font-medium">Estado del agua</dt>
                                    <dd className="text-right">{report.water_status}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="font-medium">Limpieza del agua</dt>
                                    <dd className="text-right">{report.water_cleanliness}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="font-medium">Limpieza de la playa</dt>
                                    <dd className="text-right">{report.beach_cleanliness}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="font-medium">Afluencia</dt>
                                    <dd className="text-right">{report.people_number}</dd>
                                </div>

                                <div className="flex justify-between">
                                    <dt className="font-medium">Medusas</dt>
                                    <dd className="text-right">{report.jellyfish_presence}</dd>
                                </div>

                                {report.comment && (
                                    <div className="col-span-1 mt-2">
                                        <dt className="font-medium">Comentario</dt>
                                        <dd className="mt-1 text-sm text-slate-600 bg-gray-50 p-3 rounded-md">{report.comment}</dd>
                                    </div>
                                )}
                            </dl>
                        </article>
                    ))}
                </CustomTabPanel>
            </Box>

            {/* TODO: Playas cercanas, recogidas con postgis */}
        </>
    )
}