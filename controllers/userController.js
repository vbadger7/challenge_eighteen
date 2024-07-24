const { ObjectId } = require("mongoose").Types;
const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createNewUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const userId = req.params.id;
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            const user = await User.findById(userId)
                .populate("thoughts")
                .populate("friends");

            if (!user) {
                return res.status(404).json({ message: "No user found with this id!" });
            }

            res.json(user);
        } catch (err) {
            console.error("Error in getSingleUser:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async updateSingleUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!user) {
                return res.status(404).json({ message: "No user found with this id!" });
            }
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "No user found with this id!" });
            }
            await Thought.deleteMany({ username: user.username });
            res.json({ message: "User and their thoughts deleted successfully!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: "No user found with this id!" });
            }
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: "No user found with this id!" });
            }
            res.json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    },
};