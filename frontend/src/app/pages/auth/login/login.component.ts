import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Global from 'src/app/global';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  Global = Global;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      email: [
        'admin.ivan@yopmail.com',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        'Admin@1234',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });
  }

  ngOnInit(): void {}

  login(event: any) {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.authService
        .adminLogin({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        })
        .subscribe({
          next: (res) => {
            const data = res.data;

            this.authService.doAdminLogin(data);
            this.router.navigate(['/home']);
            console.log(res.message);
          },
          // next: (res) => {
          //   const data = res.data;
          //   if (res.status == 'success') {
          //     this.authService.doAdminLogin(data);
          //     this.router.navigate(['/home']);
          //     return;
          //   } else if (res.status == 'val_error') {
          //     console.log(Global.getValidationMessage(data?.errors ?? []));
          //   } else {
          //     console.log(res.message);
          //   }
          // },
          error: (err) => {
            console.log(Global.getServerErrorMessage(err));
          },
        });
    }
  }
}
