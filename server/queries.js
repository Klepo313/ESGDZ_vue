import { Pool } from 'pg';

// Postavljanje sigurnih parametara za PostgreSQL Pool
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'ESGDZ',
  password: '2c9MeDrU!?',
  port: 5432,
});

pool.connect(); // Povezivanje s bazom podataka

