import { IsEmail, MinLength } from "class-validator";
import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import Token from "./token-entity";

import { v4 as uuid } from "uuid";

const Id: string = uuid();

@Entity()
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsEmail()
  @Column({
    length: 160,
    unique: true,
  })
  email: string;

  @Column("text")
  @MinLength(2)
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column("boolean", { default: true })
  isActive = true;

  @ManyToOne(() => Token)
  @JoinColumn()
  token: Token;

  constructor() {
    if (!this.id) {
      this.id = Id;
    }
    if (!this.id) {
      this.id = Id;
    }
  }
}
