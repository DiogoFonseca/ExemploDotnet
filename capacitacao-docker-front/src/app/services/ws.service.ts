import { Injectable } from '@angular/core';
import {ReplaySubject, Subject} from "rxjs";
import {MessageFormat} from "../chat/chat.component";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WsService {

  ws: WebSocket
  constructor() { }

  createConnection(): Subject<MessageFormat> {
    const subject: Subject<MessageFormat> = new ReplaySubject(1)
    this.ws = new WebSocket(environment.wsUrl)
    this.ws.onmessage = (event: MessageEvent) => {
      console.log(event.data)
      const data = JSON.parse(event.data)
      const dateFormatted = new Date(data.date)
      data.date = dateFormatted.toLocaleString('pt-BR')
      subject.next(data)
    }
    return subject
  }
}
