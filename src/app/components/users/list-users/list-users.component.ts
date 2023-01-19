import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectManager } from 'src/app/models/project-manager.model';
import { ProjectManagersService } from 'src/app/services/project-managers/project-managers.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  constructor(
    public readonly usersService: UsersService,
    private readonly pmService: ProjectManagersService
  ) { }

  ngOnInit(): void {
  }

  onChangeUserStatus(user: ProjectManager) {
    if(user.disabled) {
      console.log("enabled");
      this.usersService.enable(user.id);
    }else{
      console.log("disabled");
      this.usersService.delete(user.id);
    }
    
  }

  onChangeAdmin(user: ProjectManager) : Subscription {
    return this.usersService.changeAdmin(user.id,  user.admin ? false : true);
  }

  onChangeStatsEnabled(user: ProjectManager) : Subscription {
    return this.usersService.changeStatsEnabled(user.id, user.statsEnabled ? false : true);
  }

  onChangeObjectived(user: ProjectManager) {
    let objectived = user.objectived
    !objectived && this.pmService.checkGoals(user)
    this.pmService.changeObjectived(user, !objectived)
    return this.usersService.changeObjectived(user.id, !objectived);
  }
}