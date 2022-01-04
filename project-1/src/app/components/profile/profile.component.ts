import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  orders: any[] = [];
  faBook = faBook;
  faMap = faMap;
  faHeart = faHeart;
  faBookmark = faBookmark;
  faCog = faCog;
  faUser = faUser;
  faCaretDown = faCaretDown;

  
  constructor(private userService: UserService, private backendService: BackEndService, public router: Router) {
    if (this.userService.getUserId() != undefined) {
      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {
        this.user = res;
        this.backendService.getUserOrders(this.user._id).subscribe(
          res => {
            this.orders = res as Array<any>;
            this.orders = this.orders.filter(order => order.status != "cart" && order.status != "wishlist");
            console.log(this.orders);
          }
        );
      });
    }
  }

  ngOnInit(): void {
  }

}
