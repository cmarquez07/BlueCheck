import { useEffect, useState } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        window.matchMedia("(max-width: 768px)").matches
    );

    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        const handler = () => setIsMobile(media.matches);
        
        media.addEventListener("change", handler);
        return () => media.removeEventListener("chnge", handler);
    }, []);

    return isMobile;
}