import { execSync } from 'child_process';

export const query = (sql: string) => {
  try {
    const escapedSql = sql.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    const result = execSync(`team-db "${escapedSql}"`, { encoding: 'utf-8' });
    return JSON.parse(result);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const escape = (str: string | null | undefined) => {
  if (str === null || str === undefined) return '';
  return str.replace(/'/g, "''");
};
