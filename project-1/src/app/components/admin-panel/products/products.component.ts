import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BackEndService } from 'src/app/services/back-end.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [DialogService, MessageService]
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: any[] = [];
  editProduct: any;
  ref?: DynamicDialogRef;
  categories: any[] = [];

  constructor(private backendService: BackEndService, private messageService: MessageService, private router: Router, public dialogService: DialogService) {

    this.backendService.getAllCategories().subscribe(
      res => this.categories = res as Array<any>,
    );

    this.backendService.getAllProducts().subscribe(
      res => {
        this.products = res as Array<any>;
        this.products.reverse();
      }
    );
  }

  ngOnInit(): void { }

  showDetails(product: any) {

    this.editProduct = product;
    this.backendService.setEditedProduct(this.editProduct);

    this.ref = this.dialogService.open(ProductDetailsComponent, {
      header: 'Product Details',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
    });
  }

  showEdit(product: any, event: any) {

    event.stopPropagation();

    this.editProduct = product;
    this.backendService.setEditedProduct(this.editProduct);

    this.ref = this.dialogService.open(EditProductComponent, {
      header: 'Edit Product',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
    });
  }

  showConfirm(product: any, event: any) {
    event.stopPropagation();
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to delete this product' });
    this.editProduct = product;
  }

  delete() {
    this.messageService.clear('c');

    this.backendService.deleteProduct(this.editProduct!.id).subscribe(
      res => {
        this.backendService.getAllProducts().subscribe(
          res => this.products = res as Array<any>
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
