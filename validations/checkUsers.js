const { singleUser } = require("../queries/users");

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const userWithEmail = await singleUser(email);

    if (userWithEmail.length > 0) {
      return res.status(400).json({
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
