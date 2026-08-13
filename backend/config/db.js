const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connect = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.qtqr5ag.mongodb.net/ReactGram?retryWrites=true&w=majority`,
    );
    console.log("Database connected");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect };
