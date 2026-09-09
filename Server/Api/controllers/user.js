import {User} from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { tz, password, secretCode } = req.body;

        const userExists = await User.findOne({ tz: tz });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const hash = await bcrypt.hash(password, 10);

        // בדיקת הקוד הסודי מהסביבה (env)
        const role = secretCode === process.env.ADMIN_SECRET_CODE ? 'admin' : 'student';

        const newUser = new User({
            ...req.body,
            password: hash,
            role: role
        });

        const savedUser = await newUser.save();

        const token = await jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userObj = savedUser.toObject();
        delete userObj.password;

        res.status(200).send({ user: userObj, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error });
    }
};
export const login = async (req, res) => {
    try {

        const { tz, password } = req.body;

        const user = await User.findOne({ tz: tz });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials!'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials!'
            });
        }

        const token = await jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).send({
            user: userObj,
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const loginByToken = async (req, res) => {
    try {

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: 'User not found!'
            });
        }

        const token = await jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).send({
            user: userObj,
            token
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const getUserProfile = async (req, res) => {
    try {
        // ה-req.user מגיע מה-Middleware של ה-JWT (checkAuth)
        const userId = req.userId; 
        const user=await  User.findById(userId)
        // שליפת פרטים ספציפיים בלבד
        res.status(200).json({
            tz: user.tz,
            firstname: user.firstname,
            lastname: user.lastname
        });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת פרטי משתמש" });
    }
};