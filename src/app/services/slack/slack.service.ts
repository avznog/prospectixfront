import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meeting } from 'src/app/models/meeting.model';
import { Prospect } from 'src/app/models/prospect.model';
import { Slack } from 'src/app/models/slack.model';

@Injectable({
  providedIn: 'root'
})
export class SlackService {

  constructor(
    private http: HttpClient
  ) { }

  sendMeeting(prospect: Prospect) {
    this.http.post("slack/send-meeting", prospect).subscribe()
  }
}
