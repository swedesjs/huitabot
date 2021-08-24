import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Users {
  @PrimaryColumn()
  id: number

  @Column({ default: 10 })
  balance: number
}
