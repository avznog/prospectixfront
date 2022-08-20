import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreateUserDto } from 'src/app/dto/users/create-user.dto';
import { ProjectManager } from 'src/app/models/project-manager.model';
import { ResearchParamsUsers } from 'src/app/models/research-params-users.model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users = new Map<number, ProjectManager>();
  researchParamsUsers : ResearchParamsUsers = {
    skip: 0,
    take: 2
  }
  constructor(
    private http: HttpClient
  ) { 
    this.loadMore();
  }

  resetSearch(researchParamsUsers: ResearchParamsUsers) {
    this.users.clear();
    this.updateSearchParameters({
      ...researchParamsUsers,
      skip: 0
    });
  }

  updateSearchParameters(researchParamsUsers: ResearchParamsUsers) {
    if(researchParamsUsers != this.researchParamsUsers)
      this.researchParamsUsers = researchParamsUsers;
      this.loadMore();
  }

  loadMore() {
    let queryParameters = new HttpParams();

    queryParameters = queryParameters.append("take", this.researchParamsUsers.take);
    queryParameters = queryParameters.append("skip", this.researchParamsUsers.skip);

    this.http.get<ProjectManager[]>(`project-managers/find-all-paginated/`, { params: queryParameters}).subscribe(users => users.forEach(user => this.users.set(user.id, user)));
  }

  create(createUserDto: CreateUserDto) : Subscription{
    return this.http.post<ProjectManager>("project-managers/", createUserDto).subscribe(user => this.users.set(user.id, user));
  }

  delete(userId: number) : Subscription {
    return this.http.patch<ProjectManager>(`project-managers/disable/${userId}`, { disabled: true }).subscribe(() => this.users.set(userId, { ...this.users.get(userId)!, disabled: true }));
  }

  enable(userId: number) : Subscription {
    return this.http.patch<ProjectManager>(`project-managers/enable/${userId}`, { disable: false }).subscribe(() => this.users.set(userId, { ...this.users.get(userId)!, disabled: false }));
  }

  changeAdmin(userId: number,admin: boolean) : Subscription {
    return this.http.patch<ProjectManager>(`project-managers/${userId}`, {admin}).subscribe(() => this.users.set(userId, { ...this.users.get(userId)!, admin: admin}));
  }
}
