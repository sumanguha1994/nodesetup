import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import * as Global from 'src/app/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private titleService: Title) {}
  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['pageTitle']) {
            routeTitle = route!.snapshot.data['pageTitle'];
          }
          return routeTitle;
        })
      )
      .subscribe((pageTitle: string) => {
        if (pageTitle) {
          this.titleService.setTitle(`${Global.APP_NAME} - ${pageTitle}`);
        }
      });
  }
}