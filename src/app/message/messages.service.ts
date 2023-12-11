import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from './message.model';
import { Thread } from '../thread/thread.model';
import { User } from '../user/user.model';
import { filter } from 'rxjs/operators';
import { publishReplay, refCount, scan, map } from 'rxjs/operators';


interface MessagesOperation extends Function {
  (messages: Message[]): Message[]
}

const initialMessages: Message[] = [];

@Injectable({
  providedIn: 'root'
})


export class MessagesService {

  // a stream that publishea new messages only once
  newMessages: Subject<Message> = new Subject<Message>()
  // updates receives operations that will be applied to our list of messages
  updates: Subject<any> = new Subject<any>()
  messages!: Observable<Message[]>

  // action streams
  create: Subject<Message> = new Subject<Message>()
  markThreadAsRead: Subject<any> = new Subject<any>()

  constructor() { 
    this.messages = this.updates
      // watch the updates and accumulate operations on the messages
      .pipe(
        scan(
          (
            messages: Message[], 
            operation: MessagesOperation
          ) => {
            return operation(messages)
          }, initialMessages)
      )
      // make sure we can share the most recent list of messages across anyone
      // who's interested in subscribing and cache the last known list of messages
      .pipe(
        publishReplay(1),
        refCount()
      );
    
    this.create
      .pipe(
        // the map operator is a lor like Array.map function in JS array,
        // expapt it works on streams. It lets us map one value to another 
        map(function(message: Message): MessagesOperation {
          return (messages: Message[]) => {
            return messages.concat(message)
          }
        })
      )
      // hook it up to the updates stream
      .subscribe(this.updates)
    
    this.newMessages
      .subscribe(this.create)
    this.markThreadAsRead
      .pipe(
        map((thread: Thread) => {
          return (messages: Message[]) => {
            return messages.map((message: Message) => {
              // note that we're manipulating `message` directly here. Mutability
              // can be confusing and there are lots of reasons why you might want
              // to, say, copy the Message object or some other 'immutable' here
              if (message.thread.id === thread.id) {
                message.isRead = true
              }
              return message
            })
          }
        })
      )
      .subscribe(this.updates)
  }

  addMessage(newMessage: Message): void {
    this.updates.next((messages: Message[]) =>{
      return messages.concat(newMessage)
    })
  }

  messageForThreadUser(
    thread: Thread, 
    user: User
  ): Observable<Message> {
    return this.newMessages
      .pipe(
        filter((message: Message) => {
          // belongs to this thread
          return (message.thread.id === thread.id) &&
            // and isn't authored by this user
            (message.author.id !== user.id)
        })
      )
  }
}
