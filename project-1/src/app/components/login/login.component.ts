import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  loginForm = {
    email: '',
    password: '',
  }
  wrongPasswordFlag: boolean = false;
  wrongEmailFlag: boolean = false;

  constructor(private backendService: BackEndService, private router: Router, private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  login() {
    this.backendService.loginService(this.loginForm).subscribe(res => {

      let user: any = res;

      if (!user.isAdmin) {

        this.backendService.getUser(user.id).subscribe(res => {
          this.userService.setUserId(user.id);
          this.router.navigate(['/home']);
        }, error => console.log(error));

      } else {

        this.backendService.getUser(user.id).subscribe(res => {
          this.userService.setAdminId(user.id);
          this.router.navigate(['/admin']);
        }, error => console.log(error));

      }
    }, error => {

      if (error.error == "password is wrong!") {
        this.messageService.clear('tc');
        this.messageService.add({ key: 'tc', severity: 'error', closable: false, summary: 'Error', detail: 'Incorrect Password', life: 3000 });
      } else {
        this.messageService.clear('tc');
        this.messageService.add({ key: 'tc', severity: 'error', closable: false, summary: 'Error', detail: 'Incorrect E-mail', life: 3000 });
      }
    });
  }

}