import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import User from "./user-entity";
import { v4 as uuid } from "uuid";

const Id: string = uuid();

@Entity()
export default class Token {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: "timestamp" })
  expiresIn: string;

  @JoinColumn({ name: "userId" })
  @ManyToOne(() => User, (user) => user.token)
  userId: User;

  constructor() {
    if (!this.id) {
      this.id = Id;
    }
    if (!this.refreshToken) {
      this.refreshToken = Id;
    }
  }
}
