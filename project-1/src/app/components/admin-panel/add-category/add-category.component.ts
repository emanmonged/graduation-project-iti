import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
  providers: [MessageService]
})
export class AddCategoryComponent implements OnInit {

  blockedDocument: boolean = false;

  category = {
    name: '',
    icon: '',
    color: '',
  };

  constructor(private backendService: BackEndService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void { }

  add() {

    this.backendService.addCategory(this.category).subscribe(
      res => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Category Added', closable: false, life: 1000000 });
        this.blockDocument();
        setTimeout(() => {
          this.router.navigate(['/admin/categories']);
        }, 1000)
      },
      error => this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Fill all the missing fields', life: 2000 })
    );
  }

  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 10000);
  }

}
