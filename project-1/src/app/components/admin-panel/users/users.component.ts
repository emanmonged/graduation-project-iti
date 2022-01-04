import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BackEndService } from 'src/app/services/back-end.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [DialogService, MessageService]
})
export class UsersComponent implements OnInit, OnDestroy {

  products: any[] = [];
  editUser: any;
  ref?: DynamicDialogRef;
  users: any[] = [];
  admins: any[] = [];

  constructor(private backendService: BackEndService, private messageService: MessageService, private router: Router, public dialogService: DialogService) {
    this.backendService.getAllUsers().subscribe(
      res => {
        console.log(res);
        let result = res as Array<any>;
        this.admins = result.filter(user => user.isAdmin == true);
        this.users = result.filter(user => user.isAdmin == false);

        this.users.forEach(user => {
          this.backendService.getUserOrders(user._id).subscribe(
            res => {
              console.log(res);
              user.orders = res as Array<any>;
              user.pendingOrders = user.orders.filter((order: any) => order.status === 'pending');
              console.log(user);
            }
          );
        });
      }
    );
  }

  ngOnInit(): void { }

  addAdmin() {
    this.ref = this.dialogService.open(AddAdminComponent, {
      header: 'New Admin Details',
      width: '50%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
    });
  }

  showConfirm(user: any, message: string) {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: `${message}` });
    this.editUser = user;
  }

  showOrders(user: any) {
    this.ref = this.dialogService.open(UserOrdersComponent, {
      header: `(${user._id}) Order(s) Details`,
      width: '80%',
      contentStyle: { "max-height": "700px", "overflow": "auto" },
      baseZIndex: 10000,
      data: { user }
    });
  }

  delete() {
    this.messageService.clear('c');
    this.backendService.deleteUser(this.editUser._id).subscribe(
      res => {
        this.backendService.getAllUsers().subscribe(
          res => {
            let result = res as Array<any>;
            this.users = result.filter(user => user.isAdmin == false);
          }
        );
      },
    );
  }

  cancelDelete() {
    this.messageService.clear('c');
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

}
