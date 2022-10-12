import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { ChangelogsService } from './services/changelogs/changelogs.service';
import { DataThemeService } from './services/common/data-theme.service';
import { StatisticsService } from './services/statistics/statistics.service';
import { ToastsService } from './services/toasts/toasts.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prospectix';
  dataTheme: string = "";
  constructor(
    public authService: AuthService,
    public readonly dataThemeService: DataThemeService,
    public readonly changelogsService: ChangelogsService,
    public readonly router: Router,
    public readonly toastsService: ToastsService,
    private readonly statisticsService: StatisticsService
  ) { 
  }
  
  ngOnInit() {
    this.dataThemeService.sendData(localStorage.getItem("theme") || "jisep");
    
  } 
}
