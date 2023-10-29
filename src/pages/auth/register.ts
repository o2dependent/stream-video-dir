import type { APIRoute } from "astro";
import { db } from "../../services/db";
import { User } from "../../entities/user";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../../lib/jwt/generateAccessToken";
import { Device } from "../../entities/device";
import { generateDeviceCookies } from "../../lib/device/generateDeviceCookies";
import cookie from "cookie";

export const POST: APIRoute = async ({ request }) => {
	let headers = new Headers();
	const hostname = request.headers.get("host")?.replace(":4321", "") ?? "";

	const { username, password } = await request.json();
	// check if username is taken : no username can be the same regardless of case
	const query = db
		.createQueryBuilder()
		.select("user")
		.from("user", "user")
		.where("LOWER(user.username) = LOWER(:username)", { username });
	const user = await query.getOne();
	if (user) {
		return new Response(JSON.stringify({ error: "username taken" }), {
			status: 400,
		});
	}
	// create new user
	const UserRepo = db.getRepository(User);
	const newUser = new User();
	newUser.username = username;
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);
	newUser.password = hashedPassword;
	// save user
	const createdUser = await UserRepo.save(newUser);

	// create link between user and device
	const DeviceRepo = db.getRepository(Device);
	// check if device exists
	let deviceId = request.headers.get("device_id");
	if (!deviceId) {
		const [deviceIdCookie, newDeviceId] = generateDeviceCookies(
			deviceId,
			hostname,
		);
		headers.append("Set-Cookie", deviceIdCookie);
		deviceId = newDeviceId;
	}
	let device = await DeviceRepo.findOne({ where: { deviceId } });
	if (device) {
		// update device with user
		device.user = createdUser;
		await DeviceRepo.save(device);
	} else {
		// create new device
		const newDevice = new Device();
		newDevice.deviceId = deviceId ?? "";
		newDevice.user = createdUser;
		device = await DeviceRepo.save(newDevice);
	}
	// set auth_token cookie
	const accessToken = await generateAccessToken(createdUser.id, device?.id);
	headers.append(
		"Set-Cookie",
		cookie.serialize("auth_token", accessToken, {
			domain: hostname,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
			path: "/",
			sameSite: "lax",
		}),
	);
	return new Response(
		JSON.stringify({
			user: {
				id: createdUser.id,
				username: createdUser.username,
			},
		}),
		{
			headers,
		},
	);
};
