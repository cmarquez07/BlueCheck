import { useState, useEffect } from 'react'

export const BeachList = () => {
    const [beaches, setBeaches] = useState([]);

    useEffect(() => {
        const fetchBeaches = async () => {
            const response = await fetch(
                "https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/front/es"
            );
            const data = await response.json();

            setBeaches(data.playas);
        };

        fetchBeaches();
    }, []);

    return (
        <>
            {beaches.map((beach) => (
                <div key={beach.id} className='beach-card p-[20px] shrink-0 w-[250px] lg:w-full'>
                    <div className='flex items-center mb-[10px] lg:mb-[20px]'>
                        <img src={`https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/uploads/fotos/${beach.imagen_url}`}
                            alt={beach.nombre}
                            className='w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] xl:w-[200px] xl:h-[100px] object-cover rounded-xl mr-[10px] lg:mr[20px]'
                            loading='lazy'/>
                        <h3 className='text-sm xl:text-lg font-semibold text-blue-700 mb-2'>
                            {beach.nombre}
                        </h3>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600 line-clamp-3'>
                            {beach.descripcion}
                        </p>
                    </div>
                </div>
            ))}
        </>
    )
}