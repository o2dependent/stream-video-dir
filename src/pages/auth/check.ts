import type { APIRoute } from "astro";
import cookie from "cookie";

export const GET: APIRoute = async ({ request }) => {
	// check if device_id is in cookies
	const cookies = request.headers.get("cookie");
	const hostname = request.headers.get("host")?.replace(":4321", "") ?? "";
	console.log({ hostname });
	let cookieStr = "";
	// parse cookies
	const parsedCookies = cookie.parse(cookies ?? "");
	console.log({
		parsedCookies,
	});

	let deviceId = parsedCookies?.device_id ?? "";
	if (!deviceId) {
		// else create new device_id
		deviceId = Math.random().toString(36).substr(2, 9);
	}
	// set device_id in cookies
	cookieStr = cookie.serialize("device_id", deviceId, {
		domain: `${hostname}`,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
		path: "/",
		sameSite: "lax",
	});
	console.log({ cookieStr });
	// return with updated cookies being set in header
	return new Response(JSON.stringify({}), {
		headers: {
			"Set-Cookie": cookieStr,
		},
	});
};
