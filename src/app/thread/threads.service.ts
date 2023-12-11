import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs'
import { Message } from '../message/message.model'
import { Thread } from './thread.model'
import { MessagesService } from '../message/messages.service';
import { combineLatest } from 'rxjs';
import { scan, mergeMap, map } from 'rxjs/operators';

import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {

  // `threads` is a observable that contains the most up to date list of threads
  threads!: Observable<{ [key: string]: Thread }>
  // `orderedThreads` contains a newest-first chronological list of threads
  orderedThreads!: Observable<Thread[]>
  currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread())

  // `currentThreadMessages` contains the set of messages for the currently
  currentTheadMessages!: Observable<Message[]>
  constructor(
    public messagesService: MessagesService
  ) { 
    this.threads = this.messagesService.messages$
      .pipe(
        // collect the most recent messages
        // Flatten the array of messages
        mergeMap(messages => messages),
        // Collect the most recent messages
        scan(
          (threads: {[key: string]: Thread}, message: Message) => {
            // accumulate the threads
            threads[message.thread.id] = threads[message.thread.id] || message.thread

            const messages: Thread = threads[message.thread.id]
            if (!messages.lastMessage || messages.lastMessage.sentAt < message.sentAt) {
              messages.lastMessage = message
            }
            return threads
          },
          {}
        )
      )
      
    this.currentTheadMessages = combineLatest([
        this.currentThread,
        this.messagesService.messages$
      ]).pipe(
        map(([currentThread, messages]) => {
          if (currentThread && messages.length > 0) {
            return _.chain(messages)
              .filter((message: Message) => message.thread.id === currentThread.id)
              .map((message: Message) => {
                message.isRead = true;
                return message; 
              })
              .value(); 
          } else {
            return []; 
          }
        })
      );
      
    this.orderedThreads = this.threads.pipe(
      map((threadGroups: {[key: string]: Thread}) => {
        const threads: Thread[] = _.values(threadGroups)
        return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse()
      })
    )
    this.orderedThreads.subscribe((thread: Thread[]) => console.log(thread))

    this.currentThread.subscribe(this.messagesService.markThreadAsRead$)

  }

  setCurrentThread(newThread: Thread): void {
    this.currentThread.next(newThread)
  }
}
