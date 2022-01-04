import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  visibleSidebar1: any;
  user: any;
  cartOrders: any[] = [];
  cartItems: any[] = [];
  nameLabel: string = "Hello. Log In";
  userLoged: boolean = false;
  orders: any[] = [];
  items: any[] = [];
  count: number = 0;

  constructor(private primengConfig: PrimeNGConfig, private userService: UserService, private backendService: BackEndService, public router: Router) {
    this.primengConfig.ripple = true;
    if (this.userService.getUserId() != undefined) {
      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {
        this.user = res;
        this.userLoged = true;
        this.nameLabel = `${this.user.firstName} ${this.user.lastName}`;

        this.backendService.getUserOrders(this.user._id).subscribe(
          res => {

            this.orders = res as Array<any>;
            this.cartOrders = this.orders.filter(order => order.status === "cart");


            this.cartOrders.forEach(cartOrder => {
              this.items.push(...cartOrder.orderItems);
              this.count += cartOrder.orderItems[0].quantity;
            });
          }
        );
      });
    }
  }

  ngOnInit(): void { }

  faBars = faBars;
  faSearch = faSearch;
  faShoppingCart = faShoppingCart;

  navToProfile(path: any) {
    if (this.userLoged) {
      this.router.navigate([`${path.value}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('userId');
    // this.router.navigate(['/home']);
    if (this.router.url == '/home') {
      window.location.reload();
    } else {
      this.router.navigate(['/home']);
    }
  }
}

let lastKnownScrollPosition = 0;

document.addEventListener("scroll", function () {
  // get the scroll position and remove the box shadow if the nav bar at the top
  lastKnownScrollPosition = window.scrollY;
  if (lastKnownScrollPosition === 0) {
    if (document.getElementById("first-nav") != undefined) document.getElementById("first-nav")!.style.boxShadow = "none";
  } else {
    if (document.getElementById("first-nav") != undefined) document.getElementById("first-nav")!.style.boxShadow = "1px 1px 15px";
  }
});
