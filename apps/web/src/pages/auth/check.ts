import type { APIRoute } from "astro";
import cookie from "cookie";
import { generateDeviceCookies } from "../../lib/device/generateDeviceCookies";

export const GET: APIRoute = async ({ request }) => {
	// check if device_id is in cookies
	const cookies = request.headers.get("cookie");
	const hostname = request.headers.get("host")?.replace(":4321", "") ?? "";
	console.log({ hostname });
	// parse cookies
	const parsedCookies = cookie.parse(cookies ?? "");
	console.log({
		parsedCookies,
	});

	let deviceId = parsedCookies?.device_id ?? "";
	const [cookieStr] = generateDeviceCookies(deviceId, hostname);
	console.log({ cookieStr });
	// return with updated cookies being set in header
	return new Response(JSON.stringify({}), {
		headers: {
			"Set-Cookie": cookieStr,
		},
	});
};
