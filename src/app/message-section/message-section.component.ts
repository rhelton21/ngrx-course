import {Component, OnInit} from '@angular/core';
import {CurrentThreadService} from "../services/current-thread.service";
import {Observable} from "rxjs";
import {ThreadDetailVM} from "../../server/view-model/thread-detail.vm";
import {ThreadsRestService} from "../services/threads-rest.service";
import {ParticipantService} from "../services/participant.service";
import {Participant} from "../../server/model/participant";

@Component({
    selector: 'message-section',
    templateUrl: './message-section.component.html',
    styleUrls: ['./message-section.component.css']
})
export class MessageSectionComponent implements OnInit {

    participant: Participant;
    currentThread: ThreadDetailVM = null;


    constructor(
        private currentThreadService: CurrentThreadService,
        private threadsRestService: ThreadsRestService,
        private participantService: ParticipantService) {

    }


    ngOnInit() {

        this.currentThreadService.thread$.subscribe(
            thread => this.currentThread = thread,
            console.error
        );

        this.participantService.user$.subscribe(
            participant => this.participant = participant
        );

    }


    onNewMessage(input:any) {

        console.log("message emitted", input.value);

        const message = input.value;
        input.value = '';

        const newMessage = {
            participantName: this.participant.name,
            text: message,
            timestamp: new Date().getTime(),
            id: null
        };

        this.currentThread.messages.push(newMessage);

        if (this.currentThread) {
            this.threadsRestService.saveNewMessage(this.currentThread.id, this.participant.id, message)
                .subscribe(
                    () => {},
                    console.error
                );
        }
    }




}











