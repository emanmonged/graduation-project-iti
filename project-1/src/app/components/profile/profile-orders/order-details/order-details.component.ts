import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BackEndService } from 'src/app/services/back-end.service';
import { PrimeIcons } from "primeng/api";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [MessageService]
})
export class OrderDetailsComponent implements OnInit {

  order: any;
  events: any[] = [];

  constructor(private backendService: BackEndService, public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {
    this.order = this.backendService.getEditedOrder();

    console.log(this.order);

    switch (this.order.status) {
      case 'pending':
        this.events = [
          {
            status: "PENDING",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
            color: "#FFC107",
            image: "game-controller.jpg",
            data: "Your order has been submited and it is being reviewed by our system. It will be out for delivery very soon."
          },
        ];
        break;
      case 'out for delivery':
        this.events = [
          {
            status: "PENDING",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
            color: "#FFC107",
            image: "game-controller.jpg",
            data: "Your order has been submited and it is being reviewed by our system. It will be out for delivery very soon."
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
            icon: PrimeIcons.ENVELOPE,
            color: "#007BFF",
            data: "Your order has been reviewed and it is out for delivery. It will arrive within 3 to 5 official work days."
          },
        ];
        break;
      case 'delivered':
        this.events = [
          {
            status: "PENDING",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
            color: "#FFC107",
            image: "game-controller.jpg",
            data: "Your order has been submited and it is being reviewed by our system. It will be out for delivery very soon."
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
            icon: PrimeIcons.ENVELOPE,
            color: "#007BFF",
            data: "Your order has been reviewed and it is out for delivery. It will arrive within 3 to 5 official work days."
          },
          {
            status: "Delivered",
            date: `${this.dateFormat(this.order.dateDelivered)}`,
            icon: PrimeIcons.CHECK,
            color: "#3ADB76",
            data: "Your order has been delivered to you successfully."
          },
        ];
        break;
      case 'returned':
        this.events = [
          {
            status: "PENDING",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
            color: "#FFC107",
            image: "game-controller.jpg",
            data: "Your order has been submited and it is being reviewed by our system. It will be out for delivery very soon."
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
            icon: PrimeIcons.ENVELOPE,
            color: "#007BFF",
            data: "Your order has been reviewed and it is out for delivery. It will arrive within 3 to 5 official work days."
          },
          {
            status: "RETURNED",
            date: `${this.dateFormat(this.order.dateReturned)}`,
            icon: PrimeIcons.REPLAY,
            color: "#607D8B",
            data: "Your order has been canceled and returned"
          }
        ];
        break;
      default:
        this.events = [
          {
            status: "PENDING",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
            color: "#FFC107",
            image: "game-controller.jpg",
            data: "Your order has been submited and it is being reviewed by our system. It will be out for delivery very soon."
          },
          {
            status: "CANCELED",
            date: `${this.dateFormat(this.order.dateCanceled)}`,
            icon: PrimeIcons.MINUS_CIRCLE,
            color: "#FF0000",
            data: "Your canceled this order."
          },
        ];
        break;
    }
  }

  ngOnInit(): void {
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to cancel this order' });
  }

  cancelOrder() {
    this.messageService.clear('c');

    this.order.status = "canceled";
    this.order.dateCanceled = Date();

    console.log(this.order);


    this.order.orderItems.forEach((item: any) => {
      item.product.countInStock = item.product.countInStock + item.quantity;
      this.backendService.editProduct(item.product._id, item.product).subscribe();
    });

    this.backendService.changeOrderStatus(this.order._id, this.order).subscribe(
      res => {
        console.log(res);
        window.location.reload();
      }, error => console.log(error)
    );


  }

  close() {
    this.messageService.clear('c');
  }

  dateFormat(date: Date) {
    return new Date(date).getDate() + '/' + (new Date(date).getMonth() + 1) + '/' + new Date(date).getFullYear() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes();
  }

  cancel() {
    this.ref.close();
  }

}
