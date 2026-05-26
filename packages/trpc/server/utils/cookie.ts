import type {Request, Response} from "express";


const COOKIE_NAME = "auth_token";
const IS_PROD = process.env.NODE_ENV === "production";

export function setTokenCookie(res: Response, token: string){
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure:IS_PROD,
        sameSite:"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export function getTokenFromCookie(req: Request): string | null{
    return req.cookies?.[COOKIE_NAME] ?? null
}

export function clearTokenCookie(res:Response){
    res.clearCookie(COOKIE_NAME);
}