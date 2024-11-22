import { ContactRole } from 'src/common/enums/contact-role.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  longitude?: string;

  @Column({ type: 'text', nullable: true })
  latitude?: string;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: ContactRole, nullable: false, default:ContactRole.CLIENT })
  role: ContactRole;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
