import { Message } from "../message/message.model" 
import { v4 as uuidv4 } from 'uuid'

export class Thread {
  id: string = ''
  lastMessage!: Message
  name: string | undefined = ''
  avatarSrc: string | undefined = ''

  constructor(
    id?: string,
    name?: string,
    avatarSrc?: string
  ) {
    this.id = id || uuidv4()
    this.name = name
    this.avatarSrc = avatarSrc
  }
}
