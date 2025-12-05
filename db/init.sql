-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes para las playas
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    beach_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    water_status VARCHAR(50),
    water_cleanliness VARCHAR(50),
    beach_cleanliness VARCHAR(50),
    people_number VARCHAR(50),
    jellyfish_presence VARCHAR(50),
    flag_color VARCHAR(50),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla con la ubicación de las playas, para más tarde obtener playas cercanas con PostGIS
CREATE TABLE beach_location(
    beach_id SERIAL PRIMARY KEY,
    geom GEOGRAPHY(Point, 4326)
);

CREATE INDEX beach_location_geom_idx
ON beach_location
USING GIST(geom);