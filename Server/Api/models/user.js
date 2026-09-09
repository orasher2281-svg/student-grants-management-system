import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    tz:{
        type: String,
        required: true,
        unique: true,
        match: [/^\d{9}$/, "תעודת זהות חייבת להכיל 9 ספרות בדיוק"]
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student" // מאפשר להבחין בין סטודנט רגיל למנהל מערכת
    },
    requests:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
    draftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        default: null // כברירת מחדל אין למשתמש טיוטה כשהוא נרשם
    }
    
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);