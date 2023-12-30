const {
  addUser,
  allUser,
  returnUser
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/adduser", addUser);
router.post("/return", returnUser);
router.get("/alluser", allUser);



module.exports = router;
