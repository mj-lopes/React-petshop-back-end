import { Pool } from "pg";

const connectionString = 'postgres://mvqniuid:fPBvEcbs2VKD5IFDPWsFhGZTpbu7SzeH@motty.db.elephantsql.com/mvqniuid';

const db = new Pool({connectionString});

export default db;