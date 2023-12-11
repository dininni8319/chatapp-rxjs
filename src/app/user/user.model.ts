import { v4 as uuidv4 } from 'uuid';

export class User {
  id!: string

  constructor(
    public name: string,
    public avatarSrc: string
  ) {
    this.id = uuidv4()
  }
}
