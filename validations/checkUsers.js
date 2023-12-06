const { singleUser } = require("../queries/users");

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Your logic to check if the email already exists in the database
    const userWithEmail = await singleUser(email);

    if (userWithEmail) {
      return res
        .status(400)
        .json({
          error: "Email is already in use. Please choose a different one.",
        });
    }

    next();
  } catch (error) {
    console.error("Error checking duplicate email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  checkDuplicateEmail,
};
