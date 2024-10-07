import jwt, { JsonWebTokenError } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.JWT_SECRET

const addHour = (hour: number) => {
    const now = new Date();
    now.setTime(now.getTime() + (hour * 60 * 60 * 1000))
    return now;
}
export const createToken = (username: string, role: string, messier_id?: string) => {
    const expire = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign({
        exp: expire,
        username: username,
        role: role,
        messier_id: messier_id
    }, secret);
    return {
        token,
        expires: addHour(1),
    }
}

export const verifyToken = (token: string) : {
    status: boolean,
    data: any,
} => {
    try {
        const verified = jwt.verify(token, secret);
        return {
            status: true,
            data: verified
        }
    } catch (error) {
        return {
            status: false,
            data: error
        }
    }
}

export const parseJwt = (token: string): any => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            throw new Error("Invalid token");
        }
        return decoded;
    } catch (error) {
        throw new Error("Failed to parse token: " + (error as JsonWebTokenError).message);
    }
}