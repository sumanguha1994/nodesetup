import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DefaultLayoutComponent } from '../../layouts/default-layout';
import * as Global from 'src/app/global';
import PaginationOptions from 'src/app/models/PaginationOptions';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {
  members: any[] = [];

  MemberType = {
    name: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private paginationOptions: PaginationOptions,
    private defaultLayout: DefaultLayoutComponent
  ) {}

  async ngOnInit() {
    // setTimeout(() => {
    //   this.defaultLayout.PageTitle = `<i class="icon-user"></i>&nbsp;${this.MemberType.name}s`;
    //   this.defaultLayout.PageBreadcrumb = [
    //     { url: null, active: false, name: `Members` },
    //     { url: null, active: true, name: `${this.MemberType.name}s` },
    //   ];
    //   this.fetchMembers();
    // });
  }

  //   fetchMembers(page: any = null) {
  //     this.adminService
  //       .fetchMembers({
  //         page: this.paginationOptions.page,
  //       })
  //       .subscribe({
  //         next: (res) => {
  //           const data = res.data;
  //         //   if (res.status == 'success') {
  //         //     this.members = data.users?.docs ?? [];
  //         //     this.paginationOptions = {
  //         //       hasNextPage: data.users.hasNextPage,
  //         //       hasPrevPage: data.users.hasPrevPage,
  //         //       limit: data.users.limit,
  //         //       nextPage: data.users.nextPage,
  //         //       page: data.users.page,
  //         //       pagingCounter: data.users.pagingCounter,
  //         //       prevPage: data.users.prevPage,
  //         //       totalDocs: data.users.totalDocs,
  //         //       totalPages: data.users.totalPages,
  //         //     };
  //         //   }
  //           console.log(data);
  //         },
  //         error: (err) => {
  //           this.toastr.error(Global.getServerErrorMessage(err));
  //         },
  //       });
  //   }
}
