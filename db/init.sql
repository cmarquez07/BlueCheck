CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


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