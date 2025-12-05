import { Map } from '../Map'
import { BeachList } from '../BeachList'
import { useState, useEffect } from 'react'
import '../../styles/Home.css'
import { Loader } from '../Loader'

export const Home = () => {
    const [beaches, setBeaches] = useState([]);
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

    useEffect(() => {
        setLoading(true);
        const fetchBeaches = async () => {
            setLoadedImages(0);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-beach-list`);
            const data = await response.json();
            
            setBeaches(data);
        };

        fetchBeaches();
    }, []);

    return (
        <>
            <div className="main-container flex flex-col lg:flex-row justify-between h-full overflow-hidden">
                <div id="map-container" className="w-full lg:w-2/3">
                    <Map />
                </div>
                <div className="Filters">
                    filtros
                </div>
                <div id="beach-list" className="overflow-x-scroll lg:overflow-x-hidden w-full lg:w-1/3 flex flex-row lg:flex-col gap-[20px] pl-[20px] pb-[20px] xl:pl-0">
                    <BeachList beaches={beaches} onImageLoad={handleImageLoad}/>
                </div>
            </div>

            {loading && (
                <Loader />
            )}
        </>

    )
}