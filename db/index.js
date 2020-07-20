//IMPORTS THE PG MODULE
const { Client } = require('pg');


//SUPPLIES THE DB NAME ETC
const client = new Client('postgres://localhost:5432/juicebox-dev');

//GETS ALL USERS
async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username 
      FROM users;
    `);

    return rows;
}

//CREATES USER, USERNAME/PASSWORD
async function createUser({ username, password }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);

        return rows;
    } catch (error) {
        throw error;
    }
}

//EXPORTS Client, getAllUsers, & createUser
module.exports = {
    client,
    getAllUsers,
    createUser
}