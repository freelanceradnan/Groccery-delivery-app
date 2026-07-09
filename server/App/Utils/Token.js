import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'; 
dotenv.config({ path: '../../.env' });
export const TokenEncorde = (user_id) => {
    try {
        const jwt_token = process.env.JWT_SECRET
        const jwt_expires = process.env.JWT_EXPIRATION || '24h'
        const PAYLOAD = {'user_id': user_id }
        const OPTIONS = { expiresIn: jwt_expires } 
        return jwt.sign(PAYLOAD, jwt_token, OPTIONS) 
        
    } catch (error) {
        return { error: { message: error.message } }
    }
}
export const TokenDecode = (token) => {
    try {
        const jwt_token = process.env.JWT_SECRET

        return jwt.verify(token,jwt_token) 
        
    } catch (error) {
        return { error: { message: error.message } }
    }
}
