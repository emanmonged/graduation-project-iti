import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [MessageService]
})
export class AddProductComponent implements OnInit {

  blockedDocument: boolean = false;
  categories: any[] = [];
  selectedCategoryId: any;
  image?: File;
  product = {
    name: '',
    description: '',
    richDescription: '',
    brand: '',
    price: '',
    discount: 0,
    countInStock: '',
    rating: '',
    numReviews: '',
    color: '',
    isFeatured: true,
  };

  constructor(private backendService: BackEndService, private router: Router, private messageService: MessageService) {
    this.backendService.getAllCategories().subscribe(
      res => this.categories = res as Array<any>
    );
  }

  ngOnInit(): void {
  }

  getFiles(event: any) {
    this.image = <File>event.target.files[0];
  }

  setCategory(event: any) {
    for (let i = 1; i < event.target.length; i++) {
      if (event.target[i].selected == true) {
        this.selectedCategoryId = event.target[i].value;
      }
    }
  }

  add() {

    const fd = new FormData();
    fd.append('name', this.product.name);
    fd.append('description', this.product.description);
    fd.append('richDescription', this.product.richDescription);
    if (this.image != undefined) fd.append('image', this.image!, this.image!.name);
    else this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Fill all the missing fields', life: 2000 });
    fd.append('brand', this.product.brand);
    fd.append('price', this.product.price);
    fd.append('discount', `${this.product.discount}`);
    fd.append('category', this.selectedCategoryId);
    fd.append('countInStock', this.product.countInStock);
    fd.append('rating', `${0}`);
    fd.append('numReviews', `${0}`);
    fd.append('isFeatured', `${this.product.isFeatured}`);
    fd.append('color', this.product.color);

    this.backendService.addProduct(fd).subscribe(
      res => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product Added', closable: false, life: 1000000 });
        this.blockDocument();
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
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
