import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

export class Device {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, type: "text" })
	deviceId!: string;

	@ManyToOne(() => User, (user) => user.devices)
	user!: User;
}
