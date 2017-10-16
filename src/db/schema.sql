CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  photo VARCHAR(255),
  password VARCHAR(255),
  date_joined DATE
);

CREATE TABLE reviews (
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  album_id INTEGER REFERENCES albums ON DELETE CASCADE,
  date_created DATE,
  review VARCHAR(8000)
);
