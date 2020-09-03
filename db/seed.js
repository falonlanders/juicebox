const { client, getUsers, createUser, updateUser, getPosts, createPost, updatePost, getPostsByUser, getUserById, createPostTag, addTagsToPost, getPostById, getPostsByTagName } = require('./index');

async function dropTables() {
    try {
        console.log("starting dropTables");
        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `)
        console.log("finish dropTables");
    } catch (error) {
        console.error("Error at dropTables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("starting to build user tables..");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
        );
        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        
        CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags(
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
        );
        `);
        console.log("finished building tables!");
    } catch (error) {
        console.error("Error at createTables");
        throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        await createUser({
            username: 'FalonLanders',
            password: 'Zalgiris',
            name: 'Falon Landers',
            location: 'St Johns, Florida'
        });
        await createUser({
            username: 'RyanH',
            password: 'passsssy',
            name: 'Ryan Hargraves',
            location: 'Jacksonville, Florida'
        });
        await createUser({
            username: 'donna97355',
            password: 'catsssss',
            name: 'Donna Landers',
            location: 'Mars'
        });

        console.log("Finished creating users!!!");
    } catch (error) {
        console.error("Error at createInitialUsers!");
        throw error;
    }
}

async function createInitialPosts() {
    try {
        const [FalonLanders, RyanH, Donna97355] = await getUsers();

        await createPost({
            authorId: FalonLanders.id,
            title: "First post",
            content: "First Post woohoo",
            tags: ["#Cheer", "#Yay"]
        });

        await createPost({
            authorId: RyanH.id,
            title: "Second Post",
            content: "second post!!!!",
            tags: ["#godawgs", "#lame"]
        });

        await createPost({
            authorId: Donna97355.id,
            title: "Third Post",
            content: "Meooow",
            tags: ["#cats", "#kitty"]
        });
        console.log("Finished creating posts!!");
    } catch (error) {
        console.log("Error at creating initial posts!!");
        throw error;
    }
}

//all together now:
async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting DB test..");


        //testing getUser:
        const users = await getUsers();
        console.log("getUsers:", users);
        console.log("calling update user on users[0]")

        //testing updateUser:
        const updateUserResult = await updateUser(users[0].id, {
            name: "Falon Landers",
            location: "MARS"
        });
        console.log("result:", updateUserResult);

        //testing getPosts:
        console.log("calling getPosts!");
        const posts = await getPosts();
        console.log("posts:", posts);

        //testing updatePost:
        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[0].id, {
            tags: ["#yipppeeee", "#ughhh", "#ihatelaundry"]
        });
        console.log("Result:", updatePostTagsResult);

        //testing getuserbyid:
        console.log("calling getUserBy...");
        const FalonLanders = await getUserById(1);
        console.log("getUserResult:", FalonLanders);

        //test getPostByTag:
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);

        console.log("finished DB tests!");

    } catch (error) {
        console.error("Error testing DB!");
        throw error;
    }
}




rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());