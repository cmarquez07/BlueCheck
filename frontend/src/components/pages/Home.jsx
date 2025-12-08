import { Map } from '../Map'
import { BeachList } from '../BeachList'
import { useState, useEffect } from 'react'
import '../../styles/Home.css'
import { Loader } from '../Loader'
import toast from 'react-hot-toast'

export const Home = () => {
    const [beaches, setBeaches] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);

    const handleImageLoad = () => {
        setLoadedImages(prev => {
            const next = prev + 1;
            if (next === 4) {
                setLoading(false);
            }
            return next;
        })
    }

    const toggleFavorite = async (beachId) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/toggle-favorite/${beachId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        setBeaches(prev => 
            prev.map(beach =>
                beach.id === beachId
                    ? { ...beach, isFavorite: data.favorite}
                    : beach
            )
        )
        
        if (data.favorite) {
            toast.success("🌊Se ha añadido la playa a favoritos🌊");
        } else {
            toast.success("🌊Se ha eliminado la playa de favoritos🌊");
        }
    }

    useEffect(() => {
        setLoading(true);
        const fetchBeaches = async () => {
            setLoadedImages(0);

            const token = localStorage.getItem("token");
            const headers = token ? { "Authorization": `Bearer ${token}`} : {};

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-beach-list`, { headers });
            const data = await response.json();
            
            setBeaches(data);
        };

        fetchBeaches();
    }, []);

    useEffect(() => {
        const mappedMarkers = beaches.map(beach => ({
                id: beach.id,
                nombre: beach.nombre,
                imagen_url: beach.imagen_url,
                municipio: beach.municipio,
                isFavorite: beach.isFavorite,
                position: [
                    parseFloat(beach.latitud),
                    parseFloat(beach.longitud)
                ]
            }));
            setMarkers(mappedMarkers);
    }, [beaches])
    return (
        <>
            <div className="main-container flex flex-col lg:flex-row justify-between h-full overflow-hidden">
                <div id="map-container" className="w-full lg:w-2/3">
                    <Map markers={markers} onToggleFavorite={toggleFavorite} />
                </div>
                <div className="Filters">
                    filtros
                </div>
                <div id="beach-list" className="overflow-x-scroll lg:overflow-x-hidden w-full lg:w-1/3 flex flex-row lg:flex-col gap-[20px] pl-[20px] pb-[20px] xl:pl-0">
                    <BeachList beaches={beaches} onImageLoad={handleImageLoad} onToggleFavorite={toggleFavorite} />
                </div>
            </div>

            {loading && (
                <Loader />
            )}
        </>

    )
}