//DESTRUCTURS FROM THE EXPORT INTO INDEX.JS
const {
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    createPost,
    updatePost,
    getAllPosts,
    getAllTags,
    getPostsByTagName
} = require('./index');

//CALLS A QUERY WHICH DROPS ALL TABLES FROM THE DATABASE
async function dropTables() {
    try {
        console.log("Starting table drop...");
        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);
        console.log("Finished table drop!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

//CALLS A QUERY WHICH CREATES ALL TABLES FOR THE DATABASE
async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
          );
          CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          );
          CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
          );
          CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
          );
      `);
        console.log("Finished table building!");
    } catch (error) {
        console.error("Error table building!");
        throw error;
    }
}

//CREATES STARTER USERS
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        await createUser({
            username: 'iFalon',
            password: 'zalgiris',
            name: 'Falon Landers',
            location: 'Fruit Cove, Florida, USA'
        });
        await createUser({
            username: 'UGAfan',
            password: 'godogs',
            name: 'Ryan Hargraves',
            location: 'Fruit Cove, Florida, USA'
        });
        await createUser({
            username: 'DonnaK',
            password: 'TazOttis',
            name: 'Donna Landers',
            location: 'St. Johns, Florida, USA'
        });
        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

//CREATES STARTER POSTS FROM STARTER USERS
async function createInitialPosts() {
    try {
        const [falon, ryan, donna] = await getAllUsers();

        console.log("Starting to create posts...");
        await createPost({
            authorId: falon.id,
            title: "First Post",
            content: "This is my first post. Fullstack is trying to give me a heart attack I think.",
            tags: ["#happy", "#student"]
        });

        await createPost({
            authorId: ryan.id,
            title: "Yay football",
            content: "How bout them dogs?",
            tags: ["#happy", "#georgiafootball"]
        });

        await createPost({
            authorId: donna.id,
            title: "Meow",
            content: "I love my kitty cats meow meow",
            tags: ["#happy", "#meow", "#catimakittycatandidancedancedance"]
        });
        console.log("Finished creating posts!");
    } catch (error) {
        console.log("Error creating posts!");
        throw error;
    }
}

//REBUILDS DATA BASE TABLES
async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

//TESTS DATABASE 
async function testDB() {
    try {
        //START
        console.log("Starting to test database...");

        //GET ALL USERS
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);

        //UPDATING USERS
        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
            name: "Falon Hargraves",
            location: "The Moon"
        });
        console.log("Result:", updateUserResult);

        //GET ALL POSTS
        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        //POST UPDATES
        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "FINALLY MARRIED",
            content: "Cant wait to go to Mexico during a world pandemic woohoo!"
        });
        console.log("Result:", updatePostResult);

        //GET USER ID
        console.log("Calling getUserById with 1");
        const falon = await getUserById(1);
        console.log("Result:", falon);

        //UPDATE POST WITH TAGS
        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[0].id, {
            tags: ["#justmarried", "#wifelife", "#happy"]
        });

        //GET POST BY TAG
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);
        console.log("Result:", updatePostTagsResult);

        //FINISH
        console.log("Finished database tests!");
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());