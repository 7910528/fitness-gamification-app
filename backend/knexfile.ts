import { database } from '~/common/database/database.js';

console.log('Using database config:', database.environmentsConfig);
export default database.environmentsConfig;
