import mysql from "mysql2/promise";

const globalForMysql = globalThis as typeof globalThis & {
  mysqlPool?: mysql.Pool;
};

export const getMysqlPool = () => {
  if (!globalForMysql.mysqlPool) {
    globalForMysql.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }

  return globalForMysql.mysqlPool;
};
