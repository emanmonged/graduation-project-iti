import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
  providers: [MessageService]
})
export class ProfileSettingsComponent implements OnInit {

  user: any;
  edit: boolean = true;
  editedUser: any;

  constructor(private router: Router, private userService: UserService, private backendService: BackEndService, private messageService: MessageService) {
    if (this.userService.getUserId() == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.backendService.getUser(this.userService.getUserId()).subscribe(
        res => {
          this.user = res
          this.editedUser = this.user;
          this.editedUser.nationality = this.editedUser.nationality[0].toUpperCase() + this.editedUser.nationality.substring(1);
        }
      );
    }
  }

  ngOnInit(): void {
  }

  changeGov(event: any) {
    console.log(event.target.value);
  }

  editAddress() {

    this.edit = false;

    this.editedUser.birthDate = new Date(this.editedUser.birthDate);

    this.user = this.editedUser;

    console.log(this.user);

    console.log(this.user.birthDate);


    this.backendService.editAddress(this.user._id, this.user).subscribe(
      res => {
        console.log(res);
        this.edit = true;
      }
    );
  }

  delete() {
    this.backendService.deleteUser(this.user._id).subscribe(
      res => {
        localStorage.clear();
        this.router.navigate(['/home']);
      }
    );
  }

  close() {
    this.messageService.clear('c');
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to delete your account permenantly' });
  }


  cancel() {
    this.edit = true;
    this.backendService.getUser(this.user._id).subscribe(
      res => {
        let user = res as any;
        this.editedUser = user;
        this.editedUser.nationality = this.editedUser.nationality[0].toUpperCase() + this.editedUser.nationality.substring(1);
        console.log(this.editedUser);
      }
    );
  }
}
