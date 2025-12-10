import { randomizeValue, searchBeachTag, searchTemperature } from "../utils/functions.js";
import { pool } from "../config/db.js"

// Get Beach List
export const getBeachList = async (userId) => {
    const response = await fetch(
        "https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/front/es"
    );

    if (!response.ok) {
        throw new Error("🪼Error al recibir los datos oficiales🪼")
    }

    const data = await response.json();

    let favoriteIds = [];
    if (userId) {
        const favorites = await pool.query(
            `SELECT beach_id FROM favorites WHERE user_id = $1`,
            [userId]
        );
        favoriteIds = favorites.rows.map(f => f.beach_id)
    }
    
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
        estadoAgua: randomizeValue("_CALIDAD_", playa.id),
        isFavorite: favoriteIds.includes(playa.id)
    }));

    return result;
};

// Get Beach detail
export const getBeachDetail = async (userId, id) => {
    const response = await fetch(
        `https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/playadetalle/${id}/es`
    );

    if (!response.ok) {
        throw new Error("🪼Error al recibir los datos oficiales🪼")
    }

    const data = await response.json();

    // Si el usuario ha iniciado sesión, comprueba si tiene marcada la playa como favorita
    let isFavorite = false;
    if (userId) {
        const favResult = await pool.query(
            `SELECT EXISTS (SELECT 1 FROM favorites WHERE user_id = $1 AND beach_id = $2) AS is_favorite`,
            [userId, id]
        );
        
        isFavorite = favResult.rows[0].is_favorite;
    }

    // Filtrar los resultados para enviar solo los que necesito
    const { calidadPlaya, estadoMar, estadoPlaya, playa } = data.items;

    // Datos del tiempo y la playa
    const tiempo = {
        temperatura: estadoPlaya.temperatura,
        temperaturaAgua: estadoPlaya.temperaturaAgua,
        colorTemperaturaAgua: searchTemperature(estadoPlaya.temperaturaAgua),
        traduccionCielo: estadoPlaya.traduccionCielo,
        estadoCielo: searchBeachTag("_ESTADOCIELO_", estadoPlaya.etiquetaCielo),
        estadoAgua: randomizeValue("_CALIDAD_", id)
    }

    const nearbyIds = await getNearbyBeaches(id);
    const allBeaches = await getBeachList();

    const nearby = allBeaches.filter(b => nearbyIds.some(n => n.beach_id === b.id))
        .map(beach => {
            const nearbyBeach = nearbyIds.find(n => n.beach_id === beach.id);
            return {
                ...beach,
                medusas: randomizeValue("_MEDUSES_", beach.id),
                distance: nearbyBeach.distance
            };
        });

    let favoriteIds = [];
    if (userId) {
        const favorites = await pool.query(
            `SELECT beach_id FROM favorites WHERE user_id = $1`,
            [userId]
        );
        favoriteIds = favorites.rows.map(f => f.beach_id)
    }

    const nearbyBeaches = nearby.map(beach => ({
        ...beach,
        isFavorite: favoriteIds.includes(beach.id)
    }))

    const result = {
        calidadPlaya,
        estadoMar,
        tiempo: tiempo,
        playa,
        medusas: randomizeValue("_MEDUSES_", id),
        nearbyBeaches,
        isFavorite
    }

    return result;
};

export const sendReport = async (userId, { beachId, waterStatus, waterCleanliness, beachCleanliness, peopleNumber, jellyfishPresence, flagColor, comment, beachName }) => {
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
                comment,
                beach_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id`,
        [parseInt(beachId, 10), parseInt(userId, 10), waterStatus, waterCleanliness, beachCleanliness, peopleNumber, jellyfishPresence, flagColor, comment, beachName]
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

// Función para añadir la ubicacón de las playas.
export const saveBeachLocations = async () => {
    const response = await fetch(
        "https://aplicacions.aca.gencat.cat/platgescat2/agencia-catalana-del-agua-backend/web/app.php/api/front/es"
    );

    if (!response.ok) {
        throw new Error("🪼Error al recibir los datos oficiales🪼")
    }

    const data = await response.json();
    const beaches = data.playas.map(playa => ({
        id: playa.id,
        lon: playa.longitud,
        lat: playa.latitud,
    }));

    const results = [];

    for (const beach of beaches) {
        const result = await pool.query(
            `INSERT INTO beach_location (
                    beach_id,
                    geom)
                VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326)::GEOGRAPHY)
                ON CONFLICT (beach_id) DO NOTHING
                RETURNING beach_id`,
            [beach.id, beach.lon, beach.lat]
        );

        if (result.rows[0]) {
            results.push(result.rows[0]);
        }
    }

    return results;
}

// Obtener playas cercanas en un radio de 5 Km
export const getNearbyBeaches = async (beachId) => {
    const result = await pool.query(
        `SELECT
            b2.beach_id,
            ROUND((ST_Distance(b1.geom, b2.geom) / 1000)::numeric, 2) AS distance
        FROM beach_location b1
        JOIN beach_location b2 ON b1.beach_id != b2.beach_id
        WHERE b1.beach_id = $1
            AND ST_DWithin(b1.geom, b2.geom, 5000)
        ORDER BY distance`,
        [beachId]
    );

    return result.rows;
}

export const getReportsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT r.*, u.username FROM reports r INNER JOIN users u ON u.id = r.user_id WHERE user_id = $1 ORDER BY r.created_at DESC`,
        [userId]
    );

    return result.rows;
}

export const getFavoritesByUser = async (userId) => {
    const favorites = await pool.query(
        `SELECT beach_id FROM favorites WHERE user_id = $1`,
        [parseInt(userId, 10)]
    );

    const favoriteIds = favorites.rows.map(r => r.beach_id);

    if (favoriteIds.length === 0) {
        return [];
    }

    const allBeaches = await getBeachList(userId);

    const favoriteBeaches = allBeaches.filter(
        beach => favoriteIds.includes(beach.id)
    )

    return favoriteBeaches;
}

export const toggleFavoriteBeach = async (userId, beachId) => {
    const exists = await pool.query(
        `SELECT 1 FROM favorites WHERE user_id = $1 AND beach_id = $2`,
        [userId, beachId]
    );

    if (exists.rows.length > 0) {
        await pool.query(
            `DELETE FROM favorites WHERE user_id = $1 AND beach_id = $2`,
            [userId, beachId]
        );
        return {favorite: false};
    } else {
        await pool.query(
            `INSERT INTO favorites (user_id, beach_id) VALUES ($1, $2)`,
            [userId, beachId]
        );
        return {favorite: true};
    }
}