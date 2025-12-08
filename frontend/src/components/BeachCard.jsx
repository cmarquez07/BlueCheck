import { Link } from 'react-router-dom'
import { Icon } from './icons/Icon';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "../styles/BeachCard.css";

export const BeachCard = ({beach, onImageLoad, onToggleFavorite}) => {
    const handleToggleFavorite = async () => {
        onToggleFavorite(beach.id);
    }
    
    return (
        <div data-beach-id={beach?.id} data-beach-name={beach?.nombre} data-beach-municipality={beach?.municipio} className={`beach-card relative beach-card w-[240px] h-[250px] md:min-w-0 cursor-pointer bg-white rounded-2x1 shadow-md overflow-hidden transition flex-shrink-0 rounded-2xl scale-95 hover:scale-99 lg:w-full group-[.flex-col]:w-full ${beach.isFavorite ? "favorite" : ""}`}>
            <div className="absolute top-[0] right-[0]">
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab aria-label="Favorito" size="small" onClick={handleToggleFavorite}>
                        <FavoriteIcon />
                    </Fab>
                </Box>
            </div>
            <Link to={`/beach/${beach?.id}`} >
                <div className="w-full h-20 md:h-40 overflow-hidden flex items-center">
                    <img src={`https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/uploads/fotos/${beach?.imagen_url}`} 
                        alt={beach?.nombre} 
                        className="w-full h-auto object-cover"
                        onLoad={onImageLoad}
                        onError={onImageLoad}
                    />
                </div>

                <div className="p-3 lg:p-4 flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-blue-800 leading-tight text-kaushan">{beach?.nombre}</h3>

                        {beach?.distance && (
                            <span className="text-sm text-blue-800 font-semibold ">📍 A {beach.distance} Km</span>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{beach?.descripcion}</p>

                    

                    <div className="flex justify-between mt-4">
                        {/* Jellyfish status icon */}
                        <div className="flex items-center gap-1">
                            <Icon src="jellyfish.png" filter={beach?.medusas?.color} width="w-[30px]" height="w-[30px]" alt={beach?.medusas?.text}/>
                        </div>
                        
                        {/* Sky status icon */}
                        <div className="flex items-center gap-1">
                            <Icon src={beach?.estadoCielo?.icon} width="w-[30px]" height="w-[30px]" alt={beach?.estadoCielo?.text}/>
                        </div>

                        {/* Water status icon */}
                        <div className="flex items-center gap-1">
                            <Icon src="flag.png" filter={beach?.estadoAgua?.color} width="w-[30px]" height="w-[30px]" alt={beach?.estadoAgua?.text}/>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}