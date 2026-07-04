import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "24d",
      }
    );

    return token;

  } catch (error) {

    console.log(error.message);

  }
};

export default genToken;