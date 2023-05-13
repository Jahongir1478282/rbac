import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'is_deleted', default: false, select: false })
  isDeleted: boolean;

  @Column({ name: 'created_at' })
  createdAt: number;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;
}
