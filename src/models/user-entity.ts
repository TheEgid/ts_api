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
  @PrimaryGeneratedColumn()
  id: string;

  @IsEmail()
  @Column({
    length: 40,
  })
  email: string;

  @Column({
    length: 40,
  })
  name: string;

  @Column("text")
  @MinLength(2)
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isActive: boolean;

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
