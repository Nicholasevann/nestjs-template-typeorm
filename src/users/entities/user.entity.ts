import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: false, type: 'varchar', length: 255 })
  email: string;
  @Column({ nullable: false, type: 'varchar', length: 255 })
  password: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ nullable: false, type: 'varchar', length: 255 })
  firstName: string;
  @Column({ nullable: false, type: 'varchar', length: 255 })
  lastName: string;
  @Column({ nullable: true, type: 'varchar', length: 1024 })
  avatar: string;
}
