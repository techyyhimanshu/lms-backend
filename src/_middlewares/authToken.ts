
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as config from 'dotenv'

// export default function authToken(req: Request, res: Response, next: NextFunction) {
//     const secretKey = process.env.ACCESS_TOKEN as string;

//     const token = req.header('Authorization');

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     jwt.verify(token, secretKey, (err: jwt.VerifyErrors | null, user: any) => {
//         if (err) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         req.user = user;
//         next();
//     });
// }


const authToken: RequestHandler = async (req, res, next) => {
    const secretKey = process.env.ACCESS_TOKEN as string;
    //debugger
    const token = req.header('Authorization');
    const uid = req.header('Data');
    // console.log("uid from header", uid)

    const userId = `${uid}`;
    // console.log("*********", userId)

    // console.log('test');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, async (err: jwt.VerifyErrors | null, user: any): Promise<any> => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        console.log('test user data', user.data);


        // const check = await bcrypt.compare(userId, user.data);
        // console.log("is compare:", check)
        if (userId == user.data) {
            req = user.data;

            next();
        } else {
            console.log("false")
            return res.status(401).json({ message: 'User is not authorized' });
        }


    });
};

export default authToken;