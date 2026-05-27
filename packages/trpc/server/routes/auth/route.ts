import { z } from "../../schema";
import * as jwt from "jsonwebtoken";
import { authService } from "../../services/auth.service";
import { publicProcedure, router } from "../../trpc";
import { setTokenCookie } from "../../utils/cookie";


const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().
    min(8, "Password must be at least 8 characters").
    regex(/[A-Z]/, "At least one uppercase letter").
    regex(/[0-9]/, "At least one number")
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const authRouter = router({
    signup: publicProcedure.input(signupSchema).mutation(async ({input,ctx}) => {
        const userCreated = await authService.signup(input)

        const token = jwt.sign(
            {id: userCreated.id, email: userCreated.email}, 
            process.env.JWT_SECRET_KEY as string, 
            {expiresIn: "1d"}
        )

        setTokenCookie(ctx.res, token);
        return{
            success: true, 
            token,
            userCreated,
            message: "Account created successfully"
        }
    }),

    login: publicProcedure.input(loginSchema).mutation(async ({input,ctx}) => {
        const result = await authService.login(input)
        setTokenCookie(ctx.res, result.token);
        return{ success: true, token: result.token, user :{ id: result.id, name: result.name, email: result.email}}
    })
})
