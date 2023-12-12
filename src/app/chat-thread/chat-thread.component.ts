import { 
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ThreadsService } from '../thread/threads.service';
import { Thread } from '../thread/thread.model';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.scss']
})

export class ChatThreadComponent implements OnInit {
  @Input() thread!: Thread
  @Input() index!: number
  selected = false

  constructor(
    public threadsService: ThreadsService
  ) { }

  ngOnInit () {
    this.threadsService.currentThread
      .subscribe((currentThread: Thread) => {
        this.selected = (
          currentThread && 
          this.thread && 
          (currentThread.id === this.thread.id)
        )
      })
  }

  clicked(event: any): void {
    event.preventDefault()
    this.threadsService.setCurrentThread(this.thread)
  }

  checkIndex() {
    if (this.index % 2 === 0) {
      return 'box1' 
    } else {
      return 'box2'
    }
  }
}
