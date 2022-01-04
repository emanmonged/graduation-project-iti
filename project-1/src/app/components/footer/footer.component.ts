import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  loginLabel: string = "Login/Register";
  userLoged: boolean = false;

  constructor(private userService: UserService, private backendService: BackEndService, private router: Router) {
    if (this.userService.getUserId() != undefined) {
      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {
        this.loginLabel = "Logout";
        this.userLoged = true;
      }, error => console.log(error));
    }
  }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
    window.location.reload();
  }

}
