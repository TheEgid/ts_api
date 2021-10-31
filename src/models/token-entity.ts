import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

const Id: string = uuid();

@Entity()
export default class Token {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  timeKill: number;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: "userId" })
  // user: User;

  constructor() {
    if (!this.id) {
      this.id = Id;
    }
    if (!this.accessToken) {
      this.accessToken = Id;
    }
  }
}
