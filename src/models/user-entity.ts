import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 40,
  })
  email: string;

  @Column({
    length: 40,
  })
  name: string;

  @Column("text")
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  isActive: boolean;
}
