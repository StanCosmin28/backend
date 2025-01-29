const User = require("../model/User");
const roles = require("../config/roles_list");
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  //find the duplicate using the username in the database with the one we recieved from the client
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    res.status(201).json({ success: `New user ${result.username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
