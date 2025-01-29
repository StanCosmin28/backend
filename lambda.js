const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  try {
    const { password } = JSON.parse(event.body);

    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Password is required." }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return {
      statusCode: 200,
      body: JSON.stringify({ hashedPassword }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
