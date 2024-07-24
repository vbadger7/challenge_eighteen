const router = require("express").Router();
const userControllers = require("../../controllers/userController");

// User Routes
router
    .route("/")
    .get(userControllers.getAllUsers)
    .post(userControllers.createNewUser);

router
    .route("/:id")
    .get(userControllers.getSingleUser)
    .put(userControllers.updateSingleUser)
    .delete(userControllers.deleteUser);

router
    .route("/:userId/friends/:friendId")
    .post(userControllers.addFriend)
    .delete(userControllers.removeFriend);

module.exports = router;