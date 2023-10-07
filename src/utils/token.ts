import { sign, verify, type JwtPayload } from "jsonwebtoken";
import env from "@/config/env";
import { InvalidTokenError, InvalidAccessTokenError, InvalidRefreshTokenError } from "@/utils/errors";

export enum TokenType {
    ACCESS = "access",
    REFRESH = "refresh",
}

export const generateTokens = (sessionId: string): { accessToken: string; refreshToken: string } => {
    return {
        accessToken: sign(
            {
                sessionId,
                type: TokenType.ACCESS,
            },
            env.JWT_SECRET,
            { expiresIn: "15m" },
        ),
        refreshToken: sign(
            {
                sessionId,
                type: TokenType.REFRESH,
            },
            env.JWT_SECRET,
            { expiresIn: "7d" },
        ),
    };
};

export const verifyToken = (token: string, type?: TokenType): JwtPayload => {
    const decoded = verify(token, env.JWT_SECRET) as JwtPayload | null;
    if (!decoded) throw InvalidTokenError;
    if (!decoded.sessionId) throw InvalidTokenError;

    if (type && decoded.type !== type) {
        if (type === TokenType.ACCESS) throw InvalidAccessTokenError;
        throw InvalidRefreshTokenError;
    }

    return decoded;
};
