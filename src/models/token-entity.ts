import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "./user-entity";
import { v4 as uuid } from "uuid";

const userRoleId: string = uuid();

@Entity()
export default class Token {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @Column()
  expires: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = userRoleId;
    }
    if (!this.token) {
      this.token = userRoleId;
    }
  }
}
