const express = require ('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = 8080;
// setup for receive data
app.use(express.urlencoded({extended:true}));
app.use(express.json())

// connecting db
const connectDB = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testUploadBD');
      console.log("db is connected")
    } catch (error) {
        console.log("db is not connected");
        console.log(error.message);
        process.exit(1)
    }
}
// create schema 
const userSchema =new  mongoose.Schema({
    name:{
        type:String,
        require:[true ,"must fill this"]
    },
    avata:{
        type:String,
        require: [true, "must fill this"]
    }
});

// create model 
const User = mongoose.model("user", userSchema);


// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name)
    }
  })
  
  const upload = multer({ storage: storage })
app.get('/',(req,res)=>{
    res.status(200).send('welcome to server')
});

app.get('/register', (req,res)=>{
    res.status(201).sendFile(__dirname + '/index.html')
});

app.post('/register',upload.single('avata'), async (req,res)=>{
try {
    const newUser = new User({
        name:req.body.name,
        avata:req.file.filename
    });
    await newUser.save();
    res.status(201).json(newUser)
} catch (error) {
    res.status(500).send(error.message)
}    
})


app.listen(port,async()=>{
    console.log(`This server is running at http://localhost:${port}`);
    await connectDB()
})