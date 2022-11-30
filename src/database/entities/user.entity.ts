import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 120 })
  username: string;

  @Column('varchar', { length: 30, select: false })
  password: string;

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    const saltOrRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
}
