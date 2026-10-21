CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'aberto',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('aberto', 'resolvido')),
    CONSTRAINT valid_title CHECK (LENGTH(TRIM(title)) >= 3),
    CONSTRAINT valid_description CHECK (LENGTH(TRIM(description)) BETWEEN 10 AND 1000)
);