import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventDescriptionType } from 'src/app/constants/event-descriptions.type';
import { EventType } from 'src/app/constants/event.type';
import { Meeting } from 'src/app/models/meeting.model';
import { EventsService } from 'src/app/services/events/events.service';
import { MeetingsService } from 'src/app/services/meetings/meetings.service';

@Component({
  selector: 'app-each-meeting',
  templateUrl: './each-meeting.component.html',
  styleUrls: ['./each-meeting.component.scss']
})
export class EachMeetingComponent implements OnInit {

  @Input() meeting!: Meeting;

  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly eventsService: EventsService
  ) { }

  ngOnInit(): void {
  }

  onDeleteMeeting() : Subscription {
    console.log("meeting deleted");
    let pm = {
      "id": 1,
      "pseudo": "bgonzva",
      "admin": true,
      "name": "Gonzva",
      "firstname": "Benjamin",
      "mail": "bgonzva@juniorisep.com",
      "tokenEmail": "",
      "disabled": false,
      "goals": [
         
      ],
      "meetings": [
          
      ],
      "reminders": [
         
      ],
      "sentEmails": [],
      "bookmarks": [],
      "events": []
    };
    this.eventsService.create({
      type: EventType.DELETE_MEETING,
      prospect: this.meeting.prospect,
      pm: pm,
      date: new Date,
      description: EventDescriptionType.DELETE_MEETING
    });
    return this.meetingsService.deleteMeeting(this.meeting.id);
  }

  onMarkMeetingDone() : Subscription {
    console.log("meeting marked done");
    let pm = {
      "id": 1,
      "pseudo": "bgonzva",
      "admin": true,
      "name": "Gonzva",
      "firstname": "Benjamin",
      "mail": "bgonzva@juniorisep.com",
      "tokenEmail": "",
      "disabled": false,
      "goals": [
         
      ],
      "meetings": [
          
      ],
      "reminders": [
         
      ],
      "sentEmails": [],
      "bookmarks": [],
      "events": []
    };
    this.eventsService.create({
      type: EventType.DONE_MEETING,
      prospect: this.meeting.prospect,
      pm: pm,
      date: new Date,
      description: EventDescriptionType.DONE_MEETING
    });
    return this.meetingsService.markDone(this.meeting.id);
  }

  onMarkMeetingUndone() : Subscription {
    console.log("meeting marked undone");
    return this.meetingsService.markUndone(this.meeting.id);
  }
}
