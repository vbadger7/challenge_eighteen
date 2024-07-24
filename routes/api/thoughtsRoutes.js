const router = require("express").Router();
const thoughtControllers = require("../../controllers/thoughtController");

// Thought Routes
router
    .route("/")
    .get(thoughtControllers.getAllThoughts)
    .post(thoughtControllers.createThought);

router
    .route("/:thoughtId")
    .get(thoughtControllers.getSingleThought)
    .put(thoughtControllers.updateThought)
    .delete(thoughtControllers.deleteThought);

router.route("/:thoughtId/reactions").post(thoughtControllers.postReaction);

router
    .route("/:thoughtId/reactions/:reactionId")
    .delete(thoughtControllers.deleteReaction);

module.exports = router;