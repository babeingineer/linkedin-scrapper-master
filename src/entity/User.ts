import { Column, Entity, PrimaryColumn } from "typeorm";
import { compareSync, hashSync } from "bcryptjs";

@Entity()
export class User {
  @PrimaryColumn("text")
  id?: string;

  @Column("text")
  password!: string;

  validatePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  hashPassword() {
    this.password = hashSync(this.password, 8);
  }
}
