CREATE DATABASE IF NOT EXISTS db_banpick_rov
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_banpick_rov;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  role ENUM('master', 'admin') NOT NULL DEFAULT 'admin',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_permissions (
  user_id VARCHAR(36) NOT NULL,
  permission_key VARCHAR(80) NOT NULL,
  PRIMARY KEY (user_id, permission_key),
  CONSTRAINT fk_user_permissions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS heroes (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  role VARCHAR(80) NOT NULL,
  priority ENUM('ban', 'pick', 'flex') NOT NULL DEFAULT 'flex',
  image_landscape_url TEXT NOT NULL,
  image_square_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ad_clips (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  duration_seconds INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ad_playback_state (
  id VARCHAR(20) PRIMARY KEY,
  active_clip_id VARCHAR(36) NULL,
  is_playing BOOLEAN NOT NULL DEFAULT FALSE,
  is_muted BOOLEAN NOT NULL DEFAULT TRUE,
  is_looping BOOLEAN NOT NULL DEFAULT TRUE,
  volume TINYINT UNSIGNED NOT NULL DEFAULT 100,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ad_playback_active_clip
    FOREIGN KEY (active_clip_id) REFERENCES ad_clips(id)
    ON DELETE SET NULL
);

INSERT INTO users (
  id,
  username,
  password_hash,
  display_name,
  role,
  status
) VALUES (
  'master-default',
  'anonsrirat',
  '$2b$10$7HxBI7Lo3PrqBzjIMqwr8O79Vrh2QZjH0lQUHCyXfcRrB4KAtFsNO',
  'Master Admin',
  'master',
  'approved'
) ON DUPLICATE KEY UPDATE
  role = 'master',
  status = 'approved';

INSERT IGNORE INTO user_permissions (user_id, permission_key) VALUES
  ('master-default', 'controlDraft'),
  ('master-default', 'viewOverlay'),
  ('master-default', 'manageUsers'),
  ('master-default', 'manageHeroes'),
  ('master-default', 'manageAds');

INSERT IGNORE INTO ad_playback_state (
  id,
  active_clip_id,
  is_playing,
  is_muted,
  is_looping,
  volume
) VALUES (
  'main',
  NULL,
  FALSE,
  TRUE,
  TRUE,
  100
);
