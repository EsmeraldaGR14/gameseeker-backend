const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

const allUsers = async () => {
  try {
    const getAllUsers = await db.any("SELECT * FROM users");
    return getAllUsers;
  } catch (error) {
    console.error("Error in allUsers query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const getUserById = async (id) => {
  try {
    const getSingleUser = await db.any("SELECT * FROM users WHERE id = $1", id);
    return getSingleUser;
  } catch (error) {
    console.error("Error in getUserById query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const singleUser = async (email) => {
  try {
    const getSingleUser = await db.any("SELECT * FROM users WHERE email = $1", email);
    return getSingleUser;
  } catch (error) {
    console.error("Error in singleUser query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const newUser = async (data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const addNewUser = await db.any(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [data.email, hashedPassword]
    );
    return addNewUser;
  } catch (error) {
    console.error("Error in newUser query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const updateUserEmail = async (id, email) => {
  try {
    const updatedUser = await db.any(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
      [email, id]
    );
    return updatedUser;
  } catch (error) {
    console.error("Error in updateUserEmail query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const updateUserPassword = async (id, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await db.any(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [hashedPassword, id]
    );
    return updatedUser;
  } catch (error) {
    console.error("Error in updateUserPassword query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

const deleteUser = async (id) => {
  try {
    await db.any("DELETE FROM users WHERE id = $1", [id]);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error in deleteUser query:", error);
    return { success: false, error: error.message || "Internal Server Error" };
  }
};

module.exports = {
  allUsers,
  singleUser,
  newUser,
  updateUserEmail,
  updateUserPassword,
  deleteUser,
  getUserById,
};
