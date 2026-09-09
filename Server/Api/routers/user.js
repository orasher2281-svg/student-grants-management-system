import express from 'express';
import { checkAuth } from '../../middleware/checkAuthorization.js';
import { getUserProfile, login, loginByToken, register } from '../controllers/user.js';

const router=express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/loginByToken', checkAuth, loginByToken)
router.get('/getUserProfile',checkAuth,getUserProfile)

export default router;