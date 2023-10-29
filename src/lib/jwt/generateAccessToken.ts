import jwt from "jsonwebtoken";

export const generateAccessToken = async (userId: number, deviceId: number) =>
	jwt.sign({ userId, deviceId }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "168hr",
	});
