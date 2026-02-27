const router = require("express").Router();
const controller = require("../controllers/userController");

router.post("/", controller.createUser);
router.get("/:email", controller.getUserByEmail);
router.get("/", controller.getAllUsers);

module.exports = router;
