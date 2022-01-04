import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  admin = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: true,
  }

  constructor(private backendService: BackEndService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }

  add() {
    this.backendService.registerService(this.admin).subscribe(
      res => window.location.reload()
    );
  }

  cancel() {
    this.ref.close();
  }
}
