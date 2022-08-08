import { Component, OnInit } from '@angular/core';
import {WsService} from "../services/ws.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  listMessages: MessageFormat[] = []
  constructor(private wsService: WsService) { }

  ngOnInit(): void {
    this.wsService.createConnection().subscribe((e) => {
      this.listMessages.push(e)
      console.log(this.listMessages)
    })
  }

  getCurrentMessage($event: MessageFormat) {
    this.listMessages.push($event)
  }

}

export interface MessageFormat {
  message: string
  date: Date
  type: string
}
