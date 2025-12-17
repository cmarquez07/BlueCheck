import { Map } from '../components/Map';
import { BeachList } from '../components/BeachList';
import { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    const [beaches, setBeaches] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(0);
    const [filteredBeaches, setFilteredBeaches] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        jellyfish: ""
    });

    // Recoger el token del AuthContext
    const { token } = useAuth();

    // Uso de debounce en los filtros para que se apliquen 200ms despues de cambiar el input
    const [debouncedFilters] = useDebounce(filters, 500)
    

    // Mantener el loader hasta que se hayan cargado 4 imágenes,
    // para evitar saltos en el contenido si cargan las imagenes un poco tarde
    const handleImageLoad = () => {
        setLoadedImages(prev => {
            const next = prev + 1;
            if (next === 4) {
                setLoading(false);
            }
            return next;
        })
    }

    // Añadir o eliminar favorito
    const toggleFavorite = async (beachId) => {
        if (!token) {
            toast.error("🪼Debes iniciar sesión para guardar la playa como favorita🪼");
            return;
        }

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

    // Manejar los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value}))
    }
    const resetFilters = (e) => {
        setFilters({
            search: "",
            jellyfish: ""
        })
    }

    // Obtener el listado de playas
    useEffect(() => {
        const fetchBeaches = async () => {
            setLoadedImages(0);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-beach-list`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            setBeaches(data);
        };

        fetchBeaches();
    }, [token]);

    // Filtros de búsqueda y marcadores
    useEffect(() => {
        const filtered = beaches.filter(beach => {
            const searchLower = debouncedFilters.search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const matchesSearch =
                beach.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchLower) ||
                beach.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchLower);

            const matchesJellyfish = debouncedFilters.jellyfish === "" || beach.medusas.text === debouncedFilters.jellyfish;

            return matchesSearch && matchesJellyfish;
        });

        setFilteredBeaches(filtered);

        const mappedMarkers = filtered.map(beach => ({
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
    }, [beaches, debouncedFilters])
    
    return (
        <>
            <div className="main-container flex flex-col lg:flex-row justify-between h-full overflow-hidden">
                <div id="map-container" className="w-full lg:w-2/3">
                    <Map markers={markers} onToggleFavorite={toggleFavorite} />
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="filters flex gap-5 mt-3 mb-3 pl-[25px] pr-[25px] lg:pl-[15px] lg:pr-[30px] ">
                        <div className="flex flex-col lg:flex-row w-7/10 gap-3">
                            <input
                                type="text"
                                name="search"
                                placeholder="Buscar por playa o municipio"
                                value={filters.search}
                                onChange={handleFilterChange}
                                className="w-full lg:w-2/3 h-10 pl-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <Box className="w-full lg:w-1/3">
                                <FormControl fullWidth>
                                    <InputLabel id="jellyfishFilter">Medusas</InputLabel>
                                    <Select
                                        labelId="jellyfishFilter"
                                        id="jellyfishFilterSelect"
                                        name="jellyfish"
                                        value={filters.jellyfish}
                                        label="Presencia de medusas"
                                        onChange={handleFilterChange}
                                        sx={{ height: 40 }}
                                    >
                                        <MenuItem value="Sin presencia de medusas">Sin presencia de medusas</MenuItem>
                                        <MenuItem value="Presencia de medusas sin peligro">Presencia de medusas sin peligro</MenuItem>
                                        <MenuItem value="Presencia de medusas peligrosas">Presencia de medusas peligrosas</MenuItem>
                                        <MenuItem value="Presencia de medusas muy peligrosas">Presencia de medusas muy peligrosas</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <button className="w-3/10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded mt-0 mb-0 hover:bg-blue-700" onClick={resetFilters}>
                            Limpiar filtros
                        </button>
                    </div>
                    <div id="beach-list" className="overflow-x-scroll lg:overflow-x-hidden flex flex-row lg:flex-col gap-[20px] pl-[20px] pb-[20px] lg:pb-[40px] xl:pl-0 min-h-[270px]" data-testid="beachlist">
                        <BeachList beaches={filteredBeaches} onImageLoad={handleImageLoad} onToggleFavorite={toggleFavorite} />
                    </div>
                </div>
            </div>

            {loading && (
                <Loader />
            )}
        </>

    )
}