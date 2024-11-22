import { Contact } from 'src/contacts/entities/contact.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  fullname: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @OneToMany(() => Contact, (contact) => contact.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  contacts: Contact[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP`,
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP`,
    onUpdate: `CURRENT_TIMESTAMP`,
    select: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    select: false,
  })
  deletedAt: Date;
}
