import { randomizeValue, searchBeachTag, searchTemperature } from "../utils/functions.js";
import { pool } from "../config/db.js"

// Get Beach List
export const getBeachList = async () => {
    const response = await fetch(
        "https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/front/es"
    );

    if (!response.ok) {
        throw new Error("🪼Error al recibir los datos oficiales🪼")
    }

    const data = await response.json();
    
    const result = data.playas.map(playa => ({
        id: playa.id,
        nombre: playa.nombre,
        municipio: playa.municipio,
        descripcion: playa.descripcion,
        costa: playa.costa,
        imagen_url: playa.imagen_url,
        latitud: playa.latitud,
        longitud: playa.longitud,
        medusas: randomizeValue("_MEDUSES_", playa.id),
        estadoCielo: searchBeachTag("_ESTADOCIELO_", playa.estadocielo),
        estadoAgua: randomizeValue("_CALIDAD_", playa.id)
    }));

    return result;
};

// Get Beach detail
export const getBeachDetail = async (id) => {
    const response = await fetch(
        `https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/playadetalle/${id}/es`
    );

    if (!response.ok) {
        throw new Error("🪼Error al recibir los datos oficiales🪼")
    }

    const data = await response.json();

    // Filtrar los resultados para enviar solo los que necesito
    const { calidadPlaya, estadoMar, estadoPlaya, playa } = data.items;

    const tiempo = {
        temperatura: estadoPlaya.temperatura,
        temperaturaAgua: estadoPlaya.temperaturaAgua,
        colorTemperaturaAgua: searchTemperature(estadoPlaya.temperaturaAgua),
        traduccionCielo: estadoPlaya.traduccionCielo,
        estadoCielo: searchBeachTag("_ESTADOCIELO_", estadoPlaya.etiquetaCielo),
        estadoAgua: randomizeValue("_CALIDAD_", id)
    }
    
    const result = {
        calidadPlaya,
        estadoMar,
        tiempo: tiempo,
        playa,
        medusas: randomizeValue("_MEDUSES_", id)
    }

    return result;
};

export const sendReport = async ({ beachId, userId, waterStatus, waterCleanliness, beachCleanliness, peopleNumber, jellyfishPresence, flagColor, comment }) => {
    const result = await pool.query(
        `INSERT INTO reports (
                beach_id,
                user_id,
                water_status,
                water_cleanliness,
                beach_cleanliness,
                people_number,
                jellyfish_presence,
                flag_color,
                comment)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id`,
        [parseInt(beachId, 10), parseInt(userId, 10), waterStatus, waterCleanliness, beachCleanliness, peopleNumber, jellyfishPresence, flagColor, comment]
    );

    return result.rows[0];
}

export const getBeachReports = async (beachId) => {
    const result = await pool.query(
        `SELECT r.*, u.username FROM reports r INNER JOIN users u ON u.id = r.user_id WHERE beach_id = $1 ORDER BY r.created_at DESC`,
        [beachId]
    );

    return result.rows;
}