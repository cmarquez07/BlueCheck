import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { useIsMobile } from '../../utils/functions';
import "leaflet/dist/leaflet.css";

export const Map = () => {
    const isMobile = useIsMobile();

    const DEFAULT_MAP_COORDS = isMobile ? [41.40, 2.15] : [41.76, 2.20];
    const DEFAULT_MAP_ZOOM = isMobile ? 7 : 9;
    const MAP_WHEEL_ZOOM = isMobile? false : true;

    return (
        <MapContainer center={DEFAULT_MAP_COORDS} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom={MAP_WHEEL_ZOOM}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}