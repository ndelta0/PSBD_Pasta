CREATE DATABASE IF NOT EXISTS `pasta_db`;
USE `pasta_db`;

CREATE TABLE `users`
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    passwordHash TEXT         NOT NULL,
    name         TEXT         NOT NULL,
    surname      TEXT         NOT NULL,
    groupName    TEXT         NULL,
    CONSTRAINT users_uq_email
        UNIQUE (email)
);

CREATE TABLE `sessions`
(
    id        VARCHAR(36)                         NOT NULL PRIMARY KEY,
    userId    INT                                 NOT NULL,
    expiresAt TIMESTAMP                           NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT sessions_users_id_fk
        FOREIGN KEY (userId) REFERENCES pasta_db.users (id)
            ON DELETE CASCADE
);