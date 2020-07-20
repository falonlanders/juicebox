const {
    client,
    getAllUsers,
    createUser
} = require('./index');

//DROP TABLES
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS users;
      `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

//CREATE TABLES
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );
      `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

//REBUILD DATABASE
async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        throw error;
    }
}

//CREATE INITIAL USERS
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        const falon = await createUser({ username: 'falon', password: 'landers' });
        const ryan = await createUser({ username: 'ryan', password: 'hargraves' });

        console.log(falon);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

//TEST DATABASE
async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!");
        throw error;
    }
}

testDB();

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());