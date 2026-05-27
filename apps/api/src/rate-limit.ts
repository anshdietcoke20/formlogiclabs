import {redis} from "./redis";
import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
    windowSeconds: number;   
    maxRequests: number;     
    keyPrefix: string;       

}

export function rateLimit(opts: RateLimitOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        
        const forwarded = req.headers["x-forwarded-for"];

        const ip =  Array.isArray(forwarded)? forwarded[0] : forwarded ?.trim() ?? '127.0.0.1';

        const key = `rate_limit:${opts.keyPrefix}:${ip}`;

        try {
            const current = await redis.incr(key);

         
            if (current === 1) {
                await redis.expire(key, opts.windowSeconds);
            }

            res.setHeader("X-RateLimit-Limit", opts.maxRequests);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, opts.maxRequests - current));

            if (current > opts.maxRequests) {
                const ttl = await redis.ttl(key);
                res.setHeader("Retry-After", ttl);
                return res.status(429).json({
                    error: "Too many requests",
                    message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
                    retryAfter: ttl,
                });
            }

            next();
        } catch (err) {
           
            console.error("Rate limit error:", err);
            next();
        }
    };
}