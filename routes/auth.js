import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

export async function hashingpassword(password){
    const NO_OF_ROUNDS = 10;
    const salt=await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashpassword =await bcrypt.hash(password,salt);
    return hashpassword
    
}
export async function auth(req, res, next) {
  
    try {
        const data=req.header("x-auth-token");
       
        jwt.verify(data,process.env.SECRET_KEY);
        next();
    }
    catch (err) {
     res.status(401).send({'error':err.message})
    }
    
}