import { GraphQLError } from "graphql";

export const UnauthorizedError = new GraphQLError("Unauthorized", {
    extensions: { code: "UNAUTHORIZED" },
});

export const UnauthenticatedError = new GraphQLError("Not logged in", {
    extensions: { code: "UNAUTHENTICATED" },
});

export const InvalidTokenError = new GraphQLError("Invalid token", {
    extensions: { code: "INVALID_TOKEN" },
});

export const InvalidAccessTokenError = new GraphQLError("Invalid access token", {
    extensions: { code: "INVALID_ACCESS_TOKEN" },
});

export const InvalidRefreshTokenError = new GraphQLError("Invalid refresh token", {
    extensions: { code: "INVALID_REFRESH_TOKEN" },
});

export const ExpiredTokenError = new GraphQLError("Expired token", {
    extensions: { code: "EXPIRED_TOKEN" },
});

export const UserNotFoundError = new GraphQLError("User not found", {
    extensions: { code: "USER_NOT_FOUND" },
});

export const WrongPasswordError = new GraphQLError("Wrong password", {
    extensions: { code: "WRONG_PASSWORD" },
});

export const NotFoundError = new GraphQLError("Not found", {
    extensions: { code: "NOT_FOUND" },
});
