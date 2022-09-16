import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from 'src/app/services/activities/activities.service';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { CitiesService } from 'src/app/services/cities/cities.service';
import { ProjectManagersService } from 'src/app/services/project-managers/project-managers.service';

@Component({
  selector: 'app-bookmarks-research-bloc',
  templateUrl: './bookmarks-research-bloc.component.html',
  styleUrls: ['./bookmarks-research-bloc.component.scss']
})
export class BookmarksResearchBlocComponent implements OnInit {
  activity: string = "";
  city: string = "";

  constructor(
    public readonly activitiesService: ActivitiesService,
    public readonly citiesService: CitiesService,
    public readonly pmService: ProjectManagersService,
    private readonly bookmarksService: BookmarksService,
  ) { }

  ngOnInit(): void {
  
  }
  
  onEditActivity() {
    this.bookmarksService.resetSearch({
      ...this.bookmarksService.researchParamsBookmarks,
      activity: this.activity == "allActivities" ? "" : this.activity
    });
  }

  onEditCity() {
    this.bookmarksService.resetSearch({
      ...this.bookmarksService.researchParamsBookmarks,
      city: this.city == "allCities" ? "" : this.city
    });
  }
}
