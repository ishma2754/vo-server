CREATE DATABASE vitalsdatabase;

CREATE TABLE formData (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  name VARCHAR(255),
  age INTEGER,
  emergencyContact VARCHAR(255),
  gender VARCHAR(10),
  medicalConditions TEXT,
  bloodGroup VARCHAR(5)
);

CREATE TABLE inputValues (
   id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  bpSys INTEGER,
  bpDia INTEGER,
  pulseRate INTEGER,
  totalCholesterol INTEGER,
  hdlCholesterol INTEGER,
  ldlCholesterol INTEGER,
  bloodGlucoseFasting INTEGER,
  bloodGlucosePP INTEGER,
  creatinine INTEGER,
  date DATE
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    license_key VARCHAR(255)
);


CREATE TABLE pdf_reports (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  file_path VARCHAR(255),
  file_name VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);