-- Table des utilisateurs
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Table des images (publiques, sans propriétaire)
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_data BYTEA NOT NULL, -- Stockage de l'image en binaire ou URL
    created_at TIMESTAMP DEFAULT now(),
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0
);

-- Table des votes (likes/dislikes) sur les images
CREATE TABLE image_votes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_id INT REFERENCES images(id) ON DELETE CASCADE,
    "like" BOOLEAN NOT NULL, -- true = like, false = dislike
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (user_id, image_id) -- Un seul vote par utilisateur par image
);