import PocketBase from "pocketbase";

import { sequence } from "astro/middleware";
import type { MiddlewareResponseHandler } from "astro";

const pbInit: MiddlewareResponseHandler = async (
	{ locals, request, cookies },
	next,
) => {
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
	// response.headers.append("set-cookie", locals.pb.authStore.exportToCookie());
	// parse out the pb_auth cookie and get the value
	const pbcookie = locals.pb.authStore
		.exportToCookie()
		.split(";")
		.find((cookie) => cookie.includes("pb_auth"))
		?.split("=")[1];
	cookies.set("pb_auth", pbcookie ?? "", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	return response;
};

const deviceHandler: MiddlewareResponseHandler = async (
	{ locals, request, cookies, url, redirect },
	next,
) => {
	const hostname = url.hostname;
	const pathname = url.pathname;
	const profileId = cookies.get("profile_id")?.value;
	let profile: App.Locals["profile"];
	try {
		if (!profileId) throw new Error("Profile not found");
		profile = await locals?.pb?.collection("profiles")?.getOne(profileId);
		if (!profile) throw new Error("Profile not found");
	} catch (error) {
		profile = undefined;
	}

	cookies.set("profile_id", profile?.id ?? "", {
		domain: hostname,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
		path: "/",
		sameSite: "lax",
	});

	locals.profile = profile;

	if (!profile && !["/", ""].includes(pathname)) {
		return redirect("/");
	}

	let deviceId = cookies.get("device_id")?.value;

	let device: App.Locals["device"];

	try {
		if (!deviceId) throw new Error("Device not found");

		device = await locals?.pb
			?.collection("devices")
			?.getFirstListItem(
				locals?.pb?.filter("(id = {:deviceId})", { deviceId }),
			);

		if (!device) throw new Error("Device not found");
	} catch (error) {
		device = await locals?.pb?.collection("devices")?.create({
			name: "Unnamed device",
			activeProfile: locals?.profile,
		});
	}

	locals.device = device;

	cookies.set("device_id", device?.id ?? "", {
		domain: hostname,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
		path: "/",
		sameSite: "lax",
	});

	return next();
};

export const onRequest = sequence(pbInit, deviceHandler);
