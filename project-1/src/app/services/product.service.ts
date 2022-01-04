import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  product: any;

  constructor() { }

  setProduct(product: any) {
    localStorage.removeItem('product');
    localStorage.setItem('product', JSON.stringify(product));
  }

  getProduct() {
    return JSON.parse(localStorage.getItem('product')!);
  }
}
