import cookie from "cookie";

export const generateDeviceCookies = (
	deviceId: string | null | undefined,
	hostname: string,
) => {
	if (!deviceId) {
		// else create new device_id
		deviceId = Math.random().toString(36).substr(2, 9);
	}
	// set device_id in cookies
	return [
		cookie.serialize("device_id", deviceId, {
			domain: hostname,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
			path: "/",
			sameSite: "lax",
		}),
		deviceId,
	];
};
