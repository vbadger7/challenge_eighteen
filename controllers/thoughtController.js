const { ObjectId } = require("mongoose").Types;
const Thought = require("../models/Thought");

module.exports = {
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            res.status(201).json(newThought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought found with this id!" });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find({});
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const { thoughtId } = req.params;
            if (!ObjectId.isValid(thoughtId)) {
                return res.status(400).json({ message: "Invalid thought ID" });
            }

            const thought = await Thought.findById(thoughtId);
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought found with this ID!" });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async postReaction(req, res) {
        try {
            const { thoughtId } = req.params;
            if (!ObjectId.isValid(thoughtId)) {
                return res.status(400).json({ message: "Invalid thought ID" });
            }

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: req.body } },
                { new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought found with this ID!" });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const { thoughtId, reactionId } = req.params;
            if (!ObjectId.isValid(thoughtId) || !ObjectId.isValid(reactionId)) {
                return res
                    .status(400)
                    .json({ message: "Invalid thought or reaction ID" });
            }

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { reactionId: reactionId } } },
                { new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought found with this ID!" });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const { thoughtId } = req.params;
            const thought = await Thought.findByIdAndDelete(thoughtId);

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "No thought found with this ID!" });
            }

            res.json({ message: "Thought successfully deleted!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Failed to delete thought due to an internal error.",
            });
        }
    },
};