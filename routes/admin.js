const {register,login} = require("../controllers/adminController");
  
  const router = require("express").Router();
  
  router.post("/signup", register);
  router.post("/login", login);

  module.exports = router;
  