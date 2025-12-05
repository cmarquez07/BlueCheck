import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet'
import { useIsMobile } from '../../utils/functions';
import "leaflet/dist/leaflet.css";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Map = ({ markers, onToggleFavorite }) => {
    const isMobile = useIsMobile();

    const DEFAULT_MAP_COORDS = isMobile ? [41.40, 2.15] : [41.76, 2.20];
    const DEFAULT_MAP_ZOOM = isMobile ? 7 : 9;
    const MAP_WHEEL_ZOOM = isMobile? false : true;

    const handleToggleFavorite = async (id) => {
        onToggleFavorite(id);
    }
    
    const FavoriteButton = ({ isFavorite, markerId }) => {
        return (
            <div className={`absolute top-[0] right-[0] ${isFavorite ? "favorite" : ""}`}>
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab aria-label="Favorito" size="small" onClick={() => handleToggleFavorite(markerId)}>
                        <FavoriteIcon />
                    </Fab>
                </Box>
            </div>
        );
    };

    return (
        <MapContainer center={DEFAULT_MAP_COORDS} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom={MAP_WHEEL_ZOOM}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {markers.map(marker => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup >
                        <FavoriteButton key={marker.key} isFavorite={marker.isFavorite} markerId={marker.id}/>
                        <Link to={`/beach/${marker.id}`}>
                            <img src={`https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/uploads/fotos/${marker.imagen_url}`} alt={marker.nombre} className="w-full h-32 object-cover rounded-md mb-2" />
                            <div className="p-3">
                                <h3 className="text-lg font-semibold">{marker.nombre}</h3>
                                <p className="text-gray-600 text-sm m-0!">{marker.municipio}</p>
                            </div>
                        </Link>
                    </Popup>
                </Marker>
            ))}
            
        </MapContainer>
    )
}