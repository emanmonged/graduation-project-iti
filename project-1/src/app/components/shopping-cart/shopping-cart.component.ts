import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  providers: [MessageService]
})
export class ShoppingCartComponent implements OnInit {

  user: any;
  cartItems: any[] = [];
  orders: any[] = [];
  cartOrders: any[] = [];
  totalPrice: number = 0;
  count: number = 0;
  newOrderItem = {
    orderItemId: '',
    quantity: '',
    status: 'cart',
    totalPrice: ''
  }

  constructor(private userService: UserService, private backendService: BackEndService, public router: Router, private messageService: MessageService) {
    if (this.userService.getUserId() != undefined) {
      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {

        this.user = res;

        this.backendService.getUserOrders(this.user._id).subscribe(
          res => {

            this.orders = res as Array<any>;
            console.log(this.orders);
            this.cartOrders = this.orders.filter(order => order.status === "cart");
            console.log(this.cartOrders);

            let counter = 0;

            this.cartOrders.forEach(cartOrder => {

              this.cartItems.push(...cartOrder.orderItems);
              this.count += cartOrder.orderItems[0].quantity;

              console.log(cartOrder);
              this.totalPrice += cartOrder.totalPrice;

              for (; counter < this.cartItems.length; counter++) {
                this.cartItems[counter].orderId = cartOrder._id;
              }
            });

            console.log(this.totalPrice);
          }
        );
      });
    }
  }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
  }

  changeQuantity(event: any, item: any) {

    for (let i = 0; i < event.target.length; i++) {

      if (event.target[i].selected == true) {

        this.newOrderItem.orderItemId = item._id;
        this.newOrderItem.quantity = event.target[i].value;
        this.newOrderItem.totalPrice = `${item.product.price * item.quantity}`;

        console.log(this.newOrderItem.orderItemId);
        console.log(this.newOrderItem.quantity);
        console.log(this.newOrderItem.totalPrice);

        this.backendService.editProductOrderQuantity(item.orderId, this.newOrderItem).subscribe(
          res => {
            this.backendService.getUserOrders(this.user._id).subscribe(
              res => window.location.reload()
            );
          },
        );
      }
    }
  }

  deleteFromCart(orderId: any) {
    console.log(orderId);
    this.backendService.deleteFormCart(orderId).subscribe(
      res => {
        this.messageService.add({ key: 'c', severity: 'success', summary: 'Done', detail: 'Removed from Cart', life: 1000 });
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      }
    );
  }

}
