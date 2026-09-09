import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './api/routers/user.js'
import requestRouter from './api/routers/request.js'

import path from 'path';
import cors from 'cors';

dotenv.config();
const app=express();






mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to mongoDB!');
    })
    .catch(error => {
        console.error(error);
    })

// JS ל JSON המרה של גוף הבקשה מ

app.use(cors());
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/user',userRouter)
app.use('/request',requestRouter)
app.get('/', (req, res) => {
    res.send('השרת שלי עובד!');
});




const port=5555;
app.listen(port, ()=>{
    console.log(`my app is running on http://localhost:${port}`);
})