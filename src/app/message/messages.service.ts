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
  newMessages$: Subject<Message> = new Subject<Message>()
  // updates receives operations that will be applied to our list of messages
  updates$: Subject<any> = new Subject<any>();
  messages$: Observable<Message[]>;

  // Action streams
  create$: Subject<Message> = new Subject<Message>();
  markThreadAsRead$: Subject<Thread> = new Subject<Thread>();

  constructor() {
    // watch the updates and accumulate operations on the messages
    this.messages$ = this.updates$.pipe(
      scan(
        (messages: Message[], operation: MessagesOperation) => operation(messages),
        initialMessages
      ),
       // make sure we can share the most recent list of messages across anyone
      // who's interested in subscribing and cache the last known list of messages
      publishReplay(1),
      refCount()
    );

    this.create$.pipe(
      // the map operator is a lor like Array.map function in JS array,
      // expapt it works on streams. It lets us map one value to another 
      map((message: Message): MessagesOperation => {
        return (messages: Message[]) => messages.concat(message);
      })
    ).subscribe(this.updates$);

    this.newMessages$.subscribe(this.create$);
    this.markThreadAsRead$.pipe(
      map((thread: Thread) => {
        return (messages: Message[]) => messages.map((message: Message) => {
          // note that we're manipulating `message` directly here. Mutability
          // can be confusing and there are lots of reasons why you might want
          // to, say, copy the Message object or some other 'immutable' here
          if (message.thread.id === thread.id) {
            message.isRead = true;
          }
          return message;
        });
      })
      // Hook it up to the updates stream
    ).subscribe(this.updates$);
  }

  addMessage(newMessage: Message): void {
    this.updates$.next((messages: Message[]) => messages.concat(newMessage));
  }

  messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
    return this.newMessages$.pipe(
      filter((message: Message) => {
        return message.thread.id === thread.id && message.author.id !== user.id;
      })
    );
  }

 
}
