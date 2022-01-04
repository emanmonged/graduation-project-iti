import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
  providers: [MessageService]
})
export class EditCategoryComponent implements OnInit {

  blockedDocument: boolean = false;
  category?: any;

  constructor(private backendService: BackEndService, private messageService: MessageService, private router: Router) {
    this.category = this.backendService.getEditedCategory();
  }

  ngOnInit(): void {
  }

  edit() {
    this.backendService.editCategory(this.category!.id, this.category).subscribe(
      res => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Category Saved', closable: false, life: 1000000 });
        this.blockDocument();
        setTimeout(() => {
          this.router.navigate(['/admin/categories']);
        }, 1000)
      },
      error => this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Fill all the missing fields', life: 2000 })
    );
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }

  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 10000);
  }

}
