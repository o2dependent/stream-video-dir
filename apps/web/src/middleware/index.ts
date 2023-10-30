import PocketBase from "pocketbase";

import { sequence } from "astro/middleware";
import type { MiddlewareResponseHandler } from "astro";

const pbInit: MiddlewareResponseHandler = async ({ locals, request }, next) => {
	locals.pb = new PocketBase("http://127.0.0.1:8090");

	// load the store data from the request cookie string
	locals.pb.authStore.loadFromCookie(request.headers.get("cookie") || "");

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		locals.pb.authStore.isValid &&
			(await locals.pb.collection("users").authRefresh());
	} catch (_) {
		// clear the auth store on failed refresh
		locals.pb.authStore.clear();
	}

	const response = await next();

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append("set-cookie", locals.pb.authStore.exportToCookie());

	next();
};

const deviceHandler: MiddlewareResponseHandler = async (
	{ locals, request, cookies, url, redirect },
	next,
) => {
	const hostname = url.hostname;
	const pathname = url.pathname;
	const profile = cookies.get("profile")?.value;
	console.log({ pathname });
	if (!profile && !["/", ""].includes(pathname)) {
		return redirect("/");
	}
	let deviceId = cookies.get("device_id")?.value;
	if (!deviceId) {
		// else create new device_id
		deviceId = Math.random().toString(36).substr(2, 9);
	}
	cookies.set("device_id", deviceId, {
		domain: hostname,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
		path: "/",
		sameSite: "lax",
	});

	let device;
	try {
		device = await locals?.pb
			?.collection("devices")
			?.getFirstListItem(
				locals?.pb?.filter("(deviceId = {:deviceId})", { deviceId }),
			);
		if (!device) {
			throw new Error("Device not found");
		}
	} catch (error) {
		try {
			const activeProfile = await locals?.pb
				?.collection("profiles")
				?.getOne(profile ?? "");

			device = await locals?.pb?.collection("devices")?.create({
				deviceId,
				name: "Unnamed device",
				activeProfile,
			});
		} catch (error) {
			console.error(error);
		}
	}
	cookies.set("device_id", device?.deviceId ?? deviceId, {
		domain: hostname,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
		path: "/",
		sameSite: "lax",
	});

	return next();
};

export const onRequest = sequence(deviceHandler, pbInit);
