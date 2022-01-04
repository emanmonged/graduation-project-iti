import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-addresses',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css']
})
export class ProfileAddressComponent implements OnInit {

  user: any;
  edit: boolean = true;
  editedAddress = {
    firstName: '',
    lastName: '',
    governorate: '',
    city: '',
    area: '',
    street: '',
    locationType: '',
    phone: '',
    shippingNote: '',
  };

  constructor(private router: Router, private userService: UserService, private backendService: BackEndService) {

    if (this.userService.getUserId() == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.backendService.getUser(this.userService.getUserId()).subscribe(
        res => {
          this.user = res
          if (this.user.address[0]) {
            this.editedAddress = this.user.address[0];
          } else {
            this.edit = false;
          }
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

    this.user.address[0] = this.editedAddress;

    this.backendService.editAddress(this.user._id, this.user).subscribe(
      res => this.edit = true
    );
  }

  cancel() {
    this.edit = true;
    this.backendService.getUser(this.user._id).subscribe(
      res => {
        let user = res as any;
        this.editedAddress = user.address[0];
        console.log(this.editedAddress);
      }
    );
  }

}
