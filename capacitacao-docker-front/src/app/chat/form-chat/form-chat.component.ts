import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WsService} from "../../services/ws.service";
import {MessageFormat} from "../chat.component";

@Component({
  selector: 'app-form-chat',
  templateUrl: './form-chat.component.html',
  styleUrls: ['./form-chat.component.scss']
})
export class FormChatComponent implements OnInit {

  @Output()
  currentMessage: EventEmitter<MessageFormat> = new EventEmitter<MessageFormat>()

  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private wsService: WsService) {
    this.form = this.formBuilder.group({
      message: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  sendMessage() {
    const messageFormatted: MessageFormat = {
      message: String(this.form.controls['message'].value),
      date: new Date(),
      type: 'going'
    }
    this.currentMessage.emit(messageFormatted)
    console.log(JSON.stringify(messageFormatted))
    this.wsService.ws.send(JSON.stringify(messageFormatted))
    this.form.reset()
  }

}
