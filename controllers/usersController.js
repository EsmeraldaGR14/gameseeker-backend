const express = require("express");
const router = express.Router();

const {
  allUsers,
  singleUser,
  newUser,
  updateUser,
  deleteUser,
} = require("../queries/users");

router.get("/", async (req, res) => {
  try {
    const users = await allUsers();
    res.json(users);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await singleUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const addUser = await newUser(req.body);
    res.json(addUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;



