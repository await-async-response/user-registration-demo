import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// Named explicitly: without it, TypeORM derives the table name from the
// class's runtime `.name`, which production minification mangles
// differently per bundle (e.g. "u", "s", "h"), splitting data across
// multiple accidental tables.
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;
}