import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { StageType } from 'src/app/constants/stage.type';
import { CreateBookmarkDto } from 'src/app/dto/bookmarks/create-bookmark.dto';
import { Bookmark } from 'src/app/models/bookmark.model';
import { Prospect } from 'src/app/models/prospect.model';
import { ResearchParamsBookmarks } from 'src/app/models/research-params-bookmarks.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  researchParamsBookmarks: ResearchParamsBookmarks = {
    keyword: '',
    skip: 0,
    zipcode: -1000,
    activity: "allActivities"
  };
  bookmarks = new Map<number, Bookmark>();
  
  constructor(
    private http: HttpClient,
  ) { 
    this.loadMore();
  }

  resetSearch(researchParamsBookmarks: ResearchParamsBookmarks) {
    this.bookmarks.clear();
    this.updateSearchParameters({
      ...researchParamsBookmarks,
      skip: 0
    });
  }

  updateSearchParameters(researchParamsBookmarks: ResearchParamsBookmarks) {
    if(researchParamsBookmarks != this.researchParamsBookmarks)
      this.researchParamsBookmarks = researchParamsBookmarks;
      this.loadMore();
  }

  loadMore() {
    let queryParameters = new HttpParams();
      queryParameters = queryParameters.append("activity", this.researchParamsBookmarks.activity)
      queryParameters = queryParameters.append("zipcode", this.researchParamsBookmarks.zipcode)
    
    if(this.researchParamsBookmarks.skip)
      queryParameters = queryParameters.append("skip", this.researchParamsBookmarks.skip)
    
    queryParameters = queryParameters.append("keyword", this.researchParamsBookmarks.keyword)
    queryParameters = queryParameters.append("take", 20);

    this.http.get<Bookmark[]>(`bookmarks/find-all-paginated/`, { params: queryParameters}).subscribe(bookmarks => bookmarks.forEach(bookmark => this.bookmarks.set(bookmark.id, bookmark)));
  }

  create(createBookmarkDto: CreateBookmarkDto) : Subscription {
    return this.http.post<Bookmark>(`bookmarks`, createBookmarkDto).subscribe(bookmark => this.bookmarks.set(bookmark.id, { ...bookmark, prospect: { ...bookmark.prospect, stage: StageType.BOOKMARK, isBookmarked: true }}));
  }

  delete(bookmarkId: number) {
    this.http.delete<Bookmark>(`bookmarks/${bookmarkId}`).subscribe(() => this.bookmarks.delete(bookmarkId));
  }

  updateByStage(idProspect: number, stage: { stage: StageType }) {
    this.bookmarks.forEach(bookmark => {
      if(bookmark.prospect.id == idProspect)
        return bookmark.prospect.stage = stage.stage
      return bookmark
    });
  }

  updateLiveProspect(prospect: Prospect) {
    this.bookmarks.forEach(bookmark => {
      if(bookmark.prospect.id == prospect.id)
        return bookmark.prospect = prospect
      return
    })
  }
}
