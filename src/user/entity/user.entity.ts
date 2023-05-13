import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  Superadmin = 'superadmin',
  Student = 'student',
  Lecturer = 'lecturer',
  Author = 'author',
  Staff = 'staff',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Staff,
  })
  role: Role;

  @Column({ name: 'is_deleted', default: false, select: false })
  isDeleted: boolean;

  @Column({ name: 'created_at' })
  createdAt: number;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;
}
