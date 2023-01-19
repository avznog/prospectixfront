import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { StageType } from 'src/app/constants/stage.type';
import { CreateMeetingDto } from 'src/app/dto/meetings/create-meeting.dto';
import { UpdateMeetingDto } from 'src/app/dto/meetings/update-meeting.dto';
import { Meeting } from 'src/app/models/meeting.model';
import { Prospect } from 'src/app/models/prospect.model';
import { ResearchParamsMeeting } from 'src/app/models/research-params-meeting.model';
import { SlackService } from '../slack/slack.service';
import { ToastsService } from '../toasts/toasts.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {

  nbMeetings: number = 0;
  meetings = new Map<number, Meeting>();
  meetingsDone = new Map<number, Meeting>();
  researchParamsMeeting: ResearchParamsMeeting = {
    take: 20,
    skip: 0,
    done: "false"
  }
  constructor(
    private http: HttpClient,
    private readonly toastsService: ToastsService,
    private readonly slackService: SlackService
  ) { 
    this.loadMore();
    this.loadMeetingsDone();
  }


  resetSearch(researchParamsMeeting: ResearchParamsMeeting) {
    this.researchParamsMeeting.done == true || this.researchParamsMeeting.done == 'true' ? this.meetingsDone.clear() : this.meetings.clear();
    this.updateSearchParameters({
      ...researchParamsMeeting,
      take: 20,
      skip: 0
    }); 
  }

  updateSearchParameters(researchParamsMeeting: ResearchParamsMeeting) {
    if(researchParamsMeeting != this.researchParamsMeeting)
      this.researchParamsMeeting = researchParamsMeeting;
      this.researchParamsMeeting.done == true || this.researchParamsMeeting.done == 'true' ? this.loadMeetingsDone() : this.loadMore();
  }

  loadMore() {
    let queryParameters = new HttpParams();

    if(this.researchParamsMeeting.type)
      queryParameters = queryParameters.append("type", this.researchParamsMeeting.type)

    queryParameters = queryParameters.append("skip", this.researchParamsMeeting.skip)
    queryParameters = queryParameters.append("done", this.researchParamsMeeting.done)
    queryParameters = queryParameters.append("take",20)
    
    this.http.get<Meeting[]>(`meetings/find-all-paginated`, { params: queryParameters }).subscribe(meetings => meetings.forEach(meeting => this.meetings.set(meeting.id, meeting)));
    this.countMeetings();
  }

  loadMeetingsDone() {
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.append("skip",this.researchParamsMeeting.skip)
    queryParameters = queryParameters.append("take",20)
    if(this.researchParamsMeeting.type)
      queryParameters = queryParameters.append("type", this.researchParamsMeeting.type)
    
    return this.http.get<Meeting[]>(`meetings/find-all-meetings-done`, { params: queryParameters}).subscribe(meetings => meetings.forEach(meeting => this.meetingsDone.set(meeting.id, meeting)));
  }

  deleteMeeting(idMeeting: number) : Subscription {
    return this.http.delete<Meeting>(`meetings/delete/${idMeeting}`).subscribe(() => {
      this.meetings.delete(idMeeting)
      this.nbMeetings -= 1;
    });
  }

  markDone(idMeeting : number) : Subscription {
    return this.http.get<Meeting>(`meetings/mark-done/${idMeeting}`).subscribe(() => {
      this.meetings.set(idMeeting, { ...this.meetings.get(idMeeting)!, done: true })
      this.meetingsDone.set(idMeeting, { ...this.meetings.get(idMeeting)!, done: true});
      this.nbMeetings -= 1;
    });
  }

  markUndone(idMeeting: number) : Subscription {
    return this.http.get<Meeting>(`meetings/mark-undone/${idMeeting}`).subscribe(() => this.meetings.set(idMeeting, { ...this.meetings.get(idMeeting)!, done: false }));
  }

  create(createMeetingDto: CreateMeetingDto) : Subscription {
    return this.http.post<Meeting>(`meetings`, createMeetingDto).subscribe(meeting => {
      this.meetings.set(meeting.id, {...meeting, prospect: { ...meeting.prospect, stage: StageType.MEETING }})
      this.nbMeetings += 1;
      this.toastsService.addToast({
        type: "alert-info",
        message: `Rendez-vous décroché avec ${createMeetingDto.prospect.companyName}`
      })

      this.http.get<number>(`meetings/count-weekly-for-me`).subscribe(count => count == 3 && this.slackService.sendChamp())
      
    });
  }

  findAllByProspect(idProspect: number) {
    return this.http.get<Meeting[]>(`meetings/by-prospect/${idProspect}`);
  }

  update(idMeeting: number, updateMeetingDto: UpdateMeetingDto) {
    return this.http.patch<Meeting>(`meetings/${idMeeting}`, updateMeetingDto).subscribe(() => {
      this.meetings.set(idMeeting, { ...this.meetings.get(idMeeting)!, ...updateMeetingDto})
      this.toastsService.addToast({
        type: "alert-success",
        message: `Rendez-vous avec ${this.meetings.get(idMeeting)!.prospect.companyName} mis à jour`
      })
    })
  }

  updateByStage(idProspect: number, stage: { stage: StageType }) {
    this.meetings.forEach(meeting => {
      if(meeting.prospect.id == idProspect) {
        return meeting.prospect.stage = stage.stage
      }
      return meeting
    });

    this.meetingsDone.forEach(meetingDone => {
      if(meetingDone.prospect.id == idProspect) {
        return meetingDone.prospect.stage = stage.stage
      }
      return meetingDone
    })
  }

  updateLiveProspect(prospect: Prospect) {
    this.meetings.forEach(meeting => {
      if(meeting.prospect.id == prospect.id)
        return meeting.prospect = prospect
      return
    })

    this.meetingsDone.forEach(meeting => {
      if(meeting.prospect.id == prospect.id)
        return meeting.prospect = prospect
      return
    })
  }

  countMeetings() {
    let queryParameters = new HttpParams();

    if(this.researchParamsMeeting.type)
      queryParameters = queryParameters.append("type", this.researchParamsMeeting.type)

    queryParameters = queryParameters.append("skip", this.researchParamsMeeting.skip)
    queryParameters = queryParameters.append("done", this.researchParamsMeeting.done)
    queryParameters = queryParameters.append("take",20);

    return this.http.get<number>(`meetings/count-meetings`, { params: queryParameters }).subscribe(nbMeetings => this.nbMeetings = nbMeetings);
  }

  updateCommentProspect(id: number, newComment: string) {
    this.meetings.forEach(meeting => {
      if(meeting.prospect.id == id) {
        return meeting.prospect.comment = newComment
      }
      return
    })
    
    this.meetingsDone.forEach(meeting => {
      if(meeting.prospect.id == id) {
        return meeting.prospect.comment = newComment
      }
      return
    })
    
  }
}