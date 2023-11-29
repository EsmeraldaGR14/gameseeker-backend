const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  allUsers,
  singleUser,
  newUser,
  updateUser,
  deleteUser,
} = require("../queries/users");

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await allUsers();
    res.json(users);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get("/get-user-by-email/:email", async (req, res) => {
  try {
    const user = await singleUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    const addUser = await newUser(req.body);
    res.json(addUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user by email
    const [user] = await singleUser(email);

    // User not found
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Incorrect password
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({id: user.id, email: user.email});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;