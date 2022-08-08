import {Component, Input, OnInit} from '@angular/core';
import {MessageFormat} from "../chat.component";

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {

  @Input()
  listMessages: MessageFormat[] = []
  constructor() { }

  ngOnInit(): void {
  }

}
