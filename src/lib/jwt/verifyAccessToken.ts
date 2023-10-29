import jwt from "jsonwebtoken";
import cookie from "cookie";

export const authenticateToken = async (headers: Headers) => {
	// get cookies
	const cookies = headers.get("cookie");
	// parse cookies
	const parsedCookies = cookies ? cookie.parse(cookies) : null;
	const accessToken = parsedCookies?.access_token ?? "";
	if (!accessToken) {
		return { error: true, status: 401, message: "Unauthorized", payload: null };
	}

	const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
	return { error: false, status: 200, message: null, payload };
};
