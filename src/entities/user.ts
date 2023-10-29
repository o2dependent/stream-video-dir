import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./device";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, type: "text" })
	username!: string;

	@Column({ type: "text" })
	password!: string;

	@OneToMany(() => Device, (device) => device.user)
	devices!: Device[];
}
