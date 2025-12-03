import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import { Icon } from "./icons/Icon";
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

        fetchBeach();
    }, [id]);

    // // Debugging, ELIMINAR CUANDO ESTE LISTO
    // useEffect(() => {
    //     console.log("Beach actualizado:", beach);
    // }, [beach]);
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
                    <p>{beach?.tiempo?.temperatura} ºC</p>
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
                    <Icon src="flag.png" filter={beach?.tiempo?.estadoAgua?.color} width="w-[30px]" height="w-[30px]" alt="Estado del mar"/>
                    <p className="pt-[10px]">{beach?.tiempo?.estadoAgua?.text}</p>
                </div>
                )}
                {beach?.medusas &&(
                <div className="w-1/4 p-[10px] text-xs flex flex-col items-center justify-start text-center">
                    <Icon src="jellyfish.png" filter={beach?.medusas?.color} width="w-[30px]" height="w-[30px]" alt="Estado del las medusas"/>
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
                    AQUI PONER REPORTES DE USUARIOS
                </CustomTabPanel>
            </Box>

            {/* TODO: Playas cercanas, recogidas con postgis */}
        </>
    )
}