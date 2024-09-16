const jwt = require('jsonwebtoken');

module.exports = (req,res,next )=>{
    // console.log("fsihd")
    const token  = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({
            mes:'no token found'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            mes:'invalid token'
        })
    }
}
//ok