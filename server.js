require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DB_URl)
  .then(() => console.log("Database connected!"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

process.on('unhandledRejection',err =>{
  console.log("unhandled rejection");
  console.log(err.name,err.message);
  server.close(() =>{
    process.exit(1)
  })})


  process.on('uncaughtException',err =>{
    console.log("Uncaught exception");
    
    console.log(err.name,err.message);
    server.close(() =>{
      process.exit(1)
    })})
    
    // console.log(x);  //uncaught exception

    