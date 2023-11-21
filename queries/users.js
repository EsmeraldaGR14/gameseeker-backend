const db = require("../db/dbConfig");

const allUsers = async () => {
  try {
    const getAllUsers = await db.any("SELECT * FROM user");
    return getAllUsers;
  } catch (error) {
    console.error("Error in allUsers query:", error);
    throw error;
  }
};

const singleUser = async (id) => {
  try {
    const getSingleUser = await db.any("SELECT * FROM user WHERE id = $1", id);
    return getSingleUser;
  } catch (error) {
    console.error("Error in singleUser query:", error);
    throw error;
  }
};

const newUser = async (data) => {
  try {
    const addNewUser = await db.any(
      "INSERT INTO user (email, password) VALUES ($1, $2) RETURNING *",
      [data.email, data.password]
    );
    return addNewUser;
  } catch (error) {
    console.error("Error in newUser query:", error);
    throw error;
  }
};

const updateUser = async (id, data) => {
  try {
    const updatedUser = await db.any(
      "UPDATE user SET email = $1, password = $2 WHERE id = $3 RETURNING *",
      [data.email, data.password, id]
    );
    return updatedUser;
  } catch (error) {
    console.error("Error in updateUser query:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await db.any(
      "DELETE FROM user WHERE id = $1 RETURNING *",
      [id]
    );
    return deletedUser;
  } catch (error) {
    console.error("Error in deleteUser query:", error);
    throw error;
  }
};

module.exports = {
  allUsers,
  singleUser,
  newUser,
  updateUser,
  deleteUser,
};
