import { 
  Component,
  OnInit,
  Inject
} from '@angular/core';
import { Thread } from '../thread/thread.model';
import { ThreadsService } from '../thread/threads.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.scss']
})

export class ChatThreadsComponent implements OnInit {
  theards!: Observable<any>

  constructor(
    public threadsService: ThreadsService
  ) { 
    this.theards = threadsService.orderedThreads
  }

  ngOnInit(): void {
    
  }
}
