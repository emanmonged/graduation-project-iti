import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.css'],
  providers: [DialogService]
})
export class ProfileOrdersComponent implements OnInit {

  userLoged: boolean = false;
  user: any;
  orders: any[] = [];
  ref?: DynamicDialogRef;
  editOrder: any;

  constructor(private router: Router, private userService: UserService, private backendService: BackEndService, private location: Location, public dialogService: DialogService) {

    if (this.userService.getUserId() == undefined) {
      this.router.navigate(['/login']);
    } else {
      this.backendService.getUser(this.userService.getUserId()).subscribe(
        res => {
          this.user = res;
          console.log(this.user);

          this.backendService.getUserOrders(this.user._id).subscribe(
            res => {

              this.orders = res as Array<any>;

              console.log(this.orders);

              this.orders = this.orders.filter(order => order.status != "cart" && order.status != "wishlist");

              console.log(this.orders);

              // let counter = 0;

              // this.cartOrders.forEach(cartOrder => {

              //   this.cartItems.push(...cartOrder.orderItems);
              //   this.count += cartOrder.orderItems[0].quantity;
              //   this.totalPrice += cartOrder.totalPrice;

              //   for (; counter < this.cartItems.length; counter++) {
              //     this.cartItems[counter].orderId = cartOrder._id;
              //   }
              // });

              // this.grandTotal = this.totalPrice + this.shipping;
              // console.log(this.cartItems);
            }
          );
        }
      );
    }

    // if (localStorage.getItem('userProfile') == undefined) {
    //   this.user = this.location.getState();
    //   localStorage.setItem('userProfile', JSON.stringify(this.user));
    //   console.log(this.user);
    // } else {
    //   this.user = JSON.parse(localStorage.getItem('userProfile')!);
    //   console.log(this.user);
    // }
  }

  ngOnInit(): void {
  }

  showDetails(order: any) {

    this.editOrder = order;
    this.backendService.setEditedOrder(this.editOrder);

    this.ref = this.dialogService.open(OrderDetailsComponent, {
      header: 'Order Details',
      width: '80%',
      contentStyle: { "max-height": "700px", "overflow": "auto", "backgroundColor": "#F2F2F2" },
      baseZIndex: 10000,
    });
  }
}
