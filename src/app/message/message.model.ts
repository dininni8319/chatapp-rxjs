import { User } from '../user/user.model'
import { Thread } from '../thread/thread.model'
import { v4 as uuidv4 } from 'uuid'

export class Message {
  id!: string
  sentAt!: Date
  isRead!: boolean
  author!: User
  text!: string
  thread!: Thread

  constructor(obj: any) {
    this.id     =  obj && obj.id            || uuidv4()
    this.isRead =  obj && obj && obj.isRead || false
    this.sentAt =  obj && obj.sentAt        || new Date()
    this.author =  obj && obj.author        || null
    this.text   =  obj && obj.text          || null
    this.thread =  obj && obj.thread        || null
  }
}
