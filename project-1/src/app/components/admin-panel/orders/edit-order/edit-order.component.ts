import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeIcons } from "primeng/api";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
  providers: [MessageService]
})
export class EditOrderComponent implements OnInit {

  order: any;
  events: any[] = [];
  status: string = '';

  constructor(private backendService: BackEndService, public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {


    if (this.config.data) {
      this.order = this.config.data;
    } else {
      this.order = this.backendService.getEditedOrder();
    }

    switch (this.order.status) {
      case 'pending':
        this.events = [
          {
            status: "ORDERED",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
            icon: PrimeIcons.SHOPPING_CART,
          },
        ];
        break;
      case 'out for delivery':
        this.events = [
          {
            status: "ORDERED",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
          },
        ];
        break;
      case 'delivered':
        this.events = [
          {
            status: "ORDERED",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
          },
          {
            status: "DELIVERED",
            date: `${this.dateFormat(this.order.dateDelivered)}`,
          },
        ];
        break;
      case 'returned':
        this.events = [
          {
            status: "ORDERED",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
          },
          {
            status: "OUT FOR DELIVERY",
            date: `${this.dateFormat(this.order.dateReviewed)}`,
          },
          {
            status: "RETURNED",
            date: `${this.dateFormat(this.order.dateReturned)}`,
          }
        ];
        break;
      default:
        this.events = [
          {
            status: "ORDERED",
            date: `${this.dateFormat(this.order.dateOrdered)}`,
          },
          {
            status: "CANCELED",
            date: `${this.dateFormat(this.order.dateCanceled)}`,
          },
        ];
        break;
    }
  }

  ngOnInit(): void {
  }

  changeStatus(status: string) {
    switch (status) {
      case 'pending':
        console.log('pending');
        this.status = 'out for delivery';
        this.confirm('Sumbit this order out for delivery');
        break;
      case 'delivered':
        console.log('delivered');
        this.status = 'delivered';
        this.confirm('Mark this order as delivered');
        break;
      case 'returned':
        console.log('returned');
        this.status = 'returned';
        this.confirm('Mark this order as returned');
        break;
    }
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to delete this order' });
  }

  confirm(messgae: String) {
    this.messageService.clear();
    this.messageService.add({ key: 'tc', sticky: true, severity: 'info', summary: 'Are you sure?', detail: `${messgae}` });
  }

  backend() {

    console.log(this.order);

    this.messageService.clear();

    this.order.status = this.status;

    if (this.status == 'out for delivery') this.order.dateReviewed = Date();
    else if (this.status == 'delivered') this.order.dateDelivered = Date();
    else {
      this.order.dateReturned = Date();
      this.order.orderItems.forEach((item: any) => {
        item.product.countInStock = item.product.countInStock + item.quantity;
        this.backendService.editProduct(item.product._id, item.product).subscribe();
      });
    }

    console.log(this.order);


    // this.order.orderItems.forEach((item: any) => {
    //   item.product.countInStock = item.product.countInStock + item.quantity;
    //   this.backendService.editProduct(item.product._id, item.product).subscribe();
    // });

    this.backendService.changeOrderStatus(this.order._id, this.order).subscribe(
      res => {
        console.log(res);
        window.location.reload();
      }, error => console.log(error)
    );
  }

  DeletOrder() {
    this.messageService.clear('c');

    console.log(this.order);

    this.backendService.deleteOrder(this.order._id).subscribe(
      res => {
        console.log(res);
        window.location.reload();
      }, error => console.log(error)
    );
  }

  close() {
    this.messageService.clear();
  }

  dateFormat(date: Date) {
    return new Date(date).getDate() + '/' + (new Date(date).getMonth() + 1) + '/' + new Date(date).getFullYear() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes();
  }

}
