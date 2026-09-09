import jwt from 'jsonwebtoken';
export const checkAuth=(req, res, next) => {
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: 'No token provided!'})
    }
    const token=authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'No token provided!'})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err|| !decoded){
            return res.status(401).json({message: 'Invalid token!'})
        }
        req.userId=decoded._id;
        next();
    })
}