// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require("../model/User");
const roles = require("../config/roles_list");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // const duplicate = usersDB.users.find((person) => person.username === user);
  //find the duplicate using the username in the database with the one we recieved from the client
  const duplicate = await User.findOne({
    username: user,
  }).exec();

  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const newUser = {
      username: user,
      roles: { User: roles.User },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
