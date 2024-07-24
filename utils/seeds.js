const mongoose = require("mongoose");
const User = require("../models/User");
const Thought = require("../models/Thought");

// Connect to MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/socialmediaDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to BadgerDB");
        seedData();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const users = [
    {
        username: "usuario1",
        email: "usuario1@example.com",
        thoughts: [], // Will be filled after thoughts are created
        friends: [], // Will be filled after users are created
    },
    {
        username: "usuario2",
        email: "usuario2@example.com",
        thoughts: [],
        friends: [],
    },
    {
        username: "usuario3",
        email: "usuario3@example.com",
        thoughts: [],
        friends: [],
    },
    {
        username: "usuario4",
        email: "usuario4@example.com",
        thoughts: [],
        friends: [],
    },
];

const thoughts = [
    {
        thoughtText: "Quiero Decir Algo",
        username: "usuario1",
        reactions: [],
    },
    {
        thoughtText: "Tengo Un Pensamiento",
        username: "usuario2",
        reactions: [],
    },
    {
        thoughtText: "Aqui esta este pensamiento",
        username: "usuario3",
        reactions: [],
    },
];

const reactions = [
    {
        reactionBody: "Dame Un Segundo",
        username: "usuario3",
        createdAt: new Date(),
    },
    {
        reactionBody: "Que",
        username: "usuario4",
        createdAt: new Date(),
    },
];

// Function to seed the data
async function seedData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create users
        const createdUsers = await User.insertMany(users);
        console.log("Users seeded:", createdUsers);

        // Create thoughts and associate them with users
        const createdThoughts = [];
        for (const thoughtData of thoughts) {
            const thought = await Thought.create(thoughtData);
            createdThoughts.push(thought);
            const user = await User.findOne({ username: thought.username });
            user.thoughts.push(thought._id);
            await user.save();
            console.log("Thought seeded:", thought);
        }

        // Create reactions and associate them with thoughts
        for (let i = 0; i < reactions.length; i++) {
            const reactionData = reactions[i];
            const thought = createdThoughts[i % createdThoughts.length]; // Distribute reactions among thoughts
            thought.reactions.push(reactionData);
            await thought.save();
            console.log("Reaction seeded:", reactionData);
        }

        // Add friends
        const user1 = await User.findOne({ username: "usuario1" });
        const user2 = await User.findOne({ username: "usuario2" });
        const user3 = await User.findOne({ username: "usuario3" });
        const user4 = await User.findOne({ username: "usuario4" });

        user1.friends.push(user2._id); // user1 has 1 friend (user2)
        user2.friends.push(user1._id, user3._id, user4._id); // user2 has 3 friends (user1, user3, user4)

        await user1.save();
        await user2.save();

        console.log("Friends added:");
        console.log("usuario2 friends:", user1.friends);
        console.log("usuario3 friends:", user2.friends);

        console.log("Database seeding completed!");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding data:", err);
    }
}