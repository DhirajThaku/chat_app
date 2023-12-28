

//below is the important line which we have to import the controller
const {register, login,setAvatar,getAllUsers} = require("../controllers/usersController");
const router = require("express").Router();
router.post("/register",register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id",getAllUsers);
module.exports =router;