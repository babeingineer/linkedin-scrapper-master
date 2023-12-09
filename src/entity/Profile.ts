import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  first_name!: string;

  @Column("text")
  last_name!: string;

  @Column("text")
  link?: string;

  @Column("text")
  img_url!: string;

  @Column("text", { nullable: true })
  campaign?: string;

  @Column("text", { nullable: true })
  query?: string;
}
