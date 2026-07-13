import pg from "pg"; //connect node.js to postgresql databse
import dotenv from "dotenv"; //load environment variables from .env file
dotenv.config(); //load all variables from .env file into porcess.env

const {Pool} = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

//startup check
pool.connect((err) => {
    if(err){
        console.log("Database connection error:", err.stack);
    }else{
        console.log("Connected to PostgreSQL");
    }
});

export default pool;

