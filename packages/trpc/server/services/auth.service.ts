//hashpassword, check existing user, verify password, create session/token 
import bcrypt from "bcryptjs";
import  * as jwt  from "jsonwebtoken";
import { db } from "@repo/database";
import { eq } from "@repo/database";
import {TRPCError} from "@trpc/server";
import { usersTable } from "@repo/database/schema"

const JWT_SECRET = process.env.JWT_SECRET_KEY

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
}

export const authService = {
    async signup(input:{
        name:string,
        email:string,
        password:string;
    }){
        const existingUser = await db.select().from(usersTable).where(eq (usersTable.email, input.email))

        if(existingUser.length > 0){
            throw new TRPCError({
                code: "CONFLICT",
                message: "Account with this email already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(input.password, 12)

        const createUser = await db.insert(usersTable).values({
            fullName: input.name,
            email: input.email,
            password: hashedPassword,
        })
        .returning();
        return createUser[0]
    },

    async login(input: {email: string; password: string}){
        const loginUser = await  db.select().from(usersTable).where(eq (usersTable.email, input.email));

        if(loginUser.length ===0){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"No account with this email exists"
            })
        }

        const user = loginUser[0]

        const isPasswordCorrect = await bcrypt.compare(input.password, user.password)

        if(!isPasswordCorrect){
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message:"Incorrect password"
            })
        }

        const token = jwt.sign(
            {id:user.id, email:user.email},
            JWT_SECRET as string,
            {expiresIn : "7d"}
        )

        return {token, id: user.id, name: user.fullName, email: user.email}
    }
}
