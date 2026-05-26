import * as jwt from "jsonwebtoken";
import { getTokenFromCookie } from "./utils/cookie";

const JWT_SECRET = process.env.JWT_SECRET_KEY!; 

type JwtPayload = {
  id: string;
  email: string;
};

export async function createContext({req,res}: {req:any; res:any}) {
    let user:JwtPayload | null = null

    try {
        const token = getTokenFromCookie(req)

        if(token){
            user = jwt.verify(token,JWT_SECRET) as JwtPayload
        }
    } catch  {
        user = null
    }

    return {user, res}
}

export type Context = Awaited<ReturnType<typeof createContext>>;
