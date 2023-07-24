import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Global from 'src/app/global';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout';
// import {} from '@coreui/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})

export class ProfileComponent implements OnInit {
  Global = Global;
  basicDetailsForm: FormGroup;
  passwordForm: FormGroup;

  // icons = {};



  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private defaultLayout: DefaultLayoutComponent
  ) {
    this.basicDetailsForm = formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      email: [{ value: null, disabled: true }],
      mobile: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(15),
        ]),
      ],
    });

    this.passwordForm = formBuilder.group({
      current_password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
      new_password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
      new_password_confirmation: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });
  }

  async ngOnInit() {
    await this.fetchAccountDetails();
  }

  fetchAccountDetails() {
    return new Promise((resolve) => {
      this.authService.getAdminAccountDetails().subscribe({
        next: (res) => {
          const data = res.data;          
          if (res.status == 'success') {
            this.basicDetailsForm.patchValue({
              name: data.user?.name ?? null,
              email: data.user?.email ?? null,
              mobile: data.user?.mobile ?? null,
            });

            this.authService.setAdminUser(data);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.log(Global.getServerErrorMessage(err));
          resolve(false);
        },
      });
    });
  }

  updateBasicDetails(event: any) {
    this.basicDetailsForm.markAllAsTouched();
    Global.scrollToQuery('.form-control.is-invalid');

    if (this.basicDetailsForm.valid) {
      this.adminService
        .updateAdminProfile({
          operation: 'basicdetails',
          name: this.basicDetailsForm.value.name,
          email: this.basicDetailsForm.value.email,
          mobile: this.basicDetailsForm.value.mobile,
        })
        .subscribe({
          next: (res) => {
            const data = res.data;
            if (res.status == 'success') {
              Global.resetForm(this.basicDetailsForm);
              console.log(res.message);
              this.fetchAccountDetails();
            } else if (res.status == 'val_error') {
              console.log(Global.getValidationMessage(data?.errors ?? []));
            } else {
              console.log(res.message);
            }
          },
          error: (err) => {
            console.log(Global.getServerErrorMessage(err));
          },
        });
    }
  }

  updateAccountPassword(event: any) {
    this.passwordForm.markAllAsTouched();
    Global.scrollToQuery('.form-control.is-invalid');

    if (this.passwordForm.valid) {
      this.adminService
        .updateAdminProfile({
          operation: 'password',
          current_password: this.passwordForm.value.current_password,
          new_password: this.passwordForm.value.new_password,
          new_password_confirmation:
            this.passwordForm.value.new_password_confirmation,
        })
        .subscribe({
          next: (res) => {
            const data = res.data;
            if (res.status == 'success') {
              Global.resetForm(this.passwordForm);
              console.log(res.message);
            } else if (res.status == 'val_error') {
              console.log(Global.getValidationMessage(data?.errors ?? []));
            } else {
              console.log(res.message);
            }
          },
          error: (err) => {
            console.log(Global.getServerErrorMessage(err));
          },
        });
    }
  }
}
