import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product: any;
  editProduct: any;
  categories: any[] = [];
  blockedDocument: boolean = false;
  selectedCategoryId: any;
  image?: File;
  test: any;

  constructor(private backendService: BackEndService, private messageService: MessageService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    this.product = this.backendService.getEditedProduct();

    this.editProduct = {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      richDescription: this.product.richDescription,
      brand: this.product.brand,
      category: this.product.category,
      countInStock: this.product.countInStock,
      price: this.product.price,
      discount: this.product.discount,
      numReviews: this.product.numReviews,
      isFeatured: this.product.isFeatured,
      rating: this.product.rating,
      image: this.product.image,
      color: this.product.color
    };

    this.backendService.getAllCategories().subscribe(
      res => {
        this.categories = res as Array<any>;
        this.selectedCategoryId = this.product.category.id;
      }
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

  saveEdit() {

    const fd = new FormData();
    fd.append('name', this.editProduct.name);
    fd.append('description', this.editProduct.description);
    fd.append('richDescription', this.editProduct.richDescription);
    if (this.image != undefined) {
      fd.append('imageChanged', `${true}`);
      fd.append('image', this.image!, this.image!.name);
    }
    fd.append('brand', this.editProduct.brand);
    fd.append('price', `${this.editProduct.price}`);
    fd.append('discount', `${this.editProduct.discount}`);
    fd.append('category', this.selectedCategoryId);
    fd.append('countInStock', `${this.editProduct.countInStock}`);
    fd.append('rating', `${this.editProduct.rating}`);
    fd.append('numReviews', `${this.editProduct.numReviews}`);
    fd.append('isFeatured', `${this.editProduct.isFeatured}`);
    fd.append('color', this.editProduct.color);

    console.log(this.editProduct);

    this.backendService.editProduct(this.editProduct.id, fd).subscribe(
      res => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Product Saved', closable: false, life: 1000000 });
        setTimeout(() => {
          this.ref.close();
          window.location.reload();
        }, 500);
      },
    );
  }

  cancel() {
    this.ref.close();
  }
}
