import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditOrderComponent } from './edit-order/edit-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [DialogService]
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  editOrder: any;
  adminOrders: any[] = [];
  pendingOrders: any[] = [];
  ref?: DynamicDialogRef;

  constructor(private backendService: BackEndService, public dialogService: DialogService) {

    if (history.state.order) {
      this.ref = this.dialogService.open(EditOrderComponent, {
        header: 'Order Details',
        width: '80%',
        contentStyle: { "max-height": "700px", "overflow": "auto", "backgroundColor": "#F2F2F2" },
        baseZIndex: 10000,
        data: history.state.order,
      });
    }
    else console.log('false');


    this.backendService.getAllOrders().subscribe(
      res => {
        console.log(res);
        this.orders = res as Array<any>;
        this.adminOrders = this.orders.filter(order => (order.status != 'cart') && (order.status != 'wishlist'));
        this.pendingOrders = this.adminOrders.filter(order => order.status == "pending");
        console.log(this.adminOrders);
      },
      error => console.log(error)
    );
  }

  ngOnInit(): void { }

  showDetails(order: any) {

    this.editOrder = order;
    this.backendService.setEditedOrder(this.editOrder);

    this.ref = this.dialogService.open(EditOrderComponent, {
      header: 'Order Details',
      width: '80%',
      contentStyle: { "max-height": "700px", "overflow": "auto", "backgroundColor": "#F2F2F2" },
      baseZIndex: 10000,
    });
  }

}
