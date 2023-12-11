import { MessagesService } from "./messages.service"
import { Message } from "./message.model";
import { Thread } from "../thread/thread.model";
import { User } from "../user/user.model";

describe("MessageService", () => {
  it('should test',() => {
    const user: User = new User("Salvo", '')
    const thread: Thread = new Thread("t1", "Salvo", '')

    const m1: Message = new Message({
      author: user,
      thread: thread,
      text: 'Hello World!',
    })

    const m2: Message = new Message({
      author: user,
      thread: thread,
      text: "Bye Bye"
    })

    const messagesService: MessagesService = new MessagesService()
    // listen to each message as it come in

    messagesService.newMessages$
      .subscribe((message: Message) => {
        console.log("=> newMessages: " + message.text)
        
      })

    // list of streams of most current messages
    messagesService.messages$
      .subscribe((messages: Message[]) => {
        console.log("=> messages: " + messages.length)
      })
    messagesService.addMessage(m1)
    messagesService.addMessage(m2)
   
    // => messages: 1
    // => newMessages: Hi!
    // => messages: 2
    // => newMessages: Bye!
  })
})
