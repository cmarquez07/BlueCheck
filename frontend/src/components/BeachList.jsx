import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BeachCard } from "./BeachCard"

export const BeachList = () => {
    const [beaches, setBeaches] = useState([]);

    useEffect(() => {
        const fetchBeaches = async () => {
            const response = await fetch("http://localhost/api/get-beach-list");
            const data = await response.json();
            setBeaches(data);
        };

        fetchBeaches();
    }, []);

    useEffect(() => {
        console.log("Playas actualizado:", beaches);
    }, [beaches]);

    return (
        <>
            {beaches.map((beach) => (
                <BeachCard key={beach.id} beach={beach}/>
            ))}
        </>
    )
}