import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  user: any;
  orders: any[] = [];

  constructor(private backendService: BackEndService, public ref: DynamicDialogRef, public config: DynamicDialogConfig, private router: Router) {
    this.user = this.config.data.user;
    this.backendService.getUserOrders(this.user._id).subscribe(
      res => {
        console.log(res);
        this.orders = res as Array<any>;
      }
    );
  }

  ngOnInit(): void {
  }

  editOrder(order: any) {
    this.router.navigateByUrl('/admin/orders', { state: { order } });
  }

}
