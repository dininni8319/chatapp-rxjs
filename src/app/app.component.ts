import { Component } from '@angular/core';
import { MessagesService } from './message/messages.service';
import { ThreadsService } from './thread/threads.service';
import { UsersService } from './user/users.service';
import { ChatExampleData } from './data/chat-example-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-app';

  constructor(
    public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public usersService: UsersService
  ){
    ChatExampleData.init(
      messagesService, 
      threadsService, 
      usersService
    )
  }
}
