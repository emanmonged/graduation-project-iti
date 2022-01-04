import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  category: any;
  product: any;
  order: any;

  constructor(private http: HttpClient) { }

  registerService(user: any) {
    return this.http.post('http://localhost:3000/api/v1/users/register', user);
  }

  loginService(user: any) {
    return this.http.post('http://localhost:3000/api/v1/users/login', user);
  }

  getUser(id: any) {
    return this.http.get(`http://localhost:3000/api/v1/users/${id}`);
  }

  editAddress(id: any, address: any) {
    return this.http.put(`http://localhost:3000/api/v1/users/${id}`, address);
  }

  addCategory(category: any) {
    return this.http.post('http://localhost:3000/api/v1/categories', category);
  }

  getAllCategories() {
    return this.http.get('http://localhost:3000/api/v1/categories');
  }

  setEditedCategory(category: any) {
    this.category = category;
  }

  getEditedCategory() {
    return this.category;
  }

  editCategory(id: any, category: any) {
    return this.http.put(`http://localhost:3000/api/v1/categories/${id}`, category);
  }

  deleteCategory(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/categories/${id}`);
  }

  addProduct(product: any) {
    return this.http.post('http://localhost:3000/api/v1/products', product);
  }

  setEditedProduct(product: any) {
    this.product = product;
  }

  getEditedProduct() {
    return this.product;
  }

  editProduct(id: any, product: any) {
    return this.http.put(`http://localhost:3000/api/v1/products/${id}`, product);
  }

  deleteProduct(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/products/${id}`);
  }

  getAllProducts() {
    return this.http.get('http://localhost:3000/api/v1/products');
  }

  addToCart(product: any) {
    return this.http.post('http://localhost:3000/api/v1/orders/', product);
  }

  getUserOrders(id: any) {
    return this.http.get(`http://localhost:3000/api/v1/orders/get/userorders/${id}`);
  }

  deleteFormCart(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/orders/${id}`);
  }

  editProductOrderQuantity(orderId: any, newOrderItem: any) {
    return this.http.put(`http://localhost:3000/api/v1/orders/${orderId}`, newOrderItem);
  }

  deleteCartOrder(id: any) {
    this.http.delete(`http://localhost:3000/api/v1/orders/${id}`).subscribe();
  }

  makeOrder(order: any) {
    return this.http.post('http://localhost:3000/api/v1/orders/', order);
  }

  setEditedOrder(order: any) {
    this.order = order;
  }

  getEditedOrder() {
    return this.order;
  }

  changeOrderStatus(orderId: any, newOrder: any) {
    return this.http.put(`http://localhost:3000/api/v1/orders/${orderId}`, newOrder);
  }

  deleteUser(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/users/${id}`);
  }

  getAllOrders() {
    return this.http.get('http://localhost:3000/api/v1/orders');
  }

  deleteOrder(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/orders/${id}`);
  }

  getCategoryProducts(categoryID: any) {
    return this.http.get(`http://localhost:3000/api/v1/products?categories=${categoryID}`);
  }

  getAllUsers() {
    return this.http.get('http://localhost:3000/api/v1/users');
  }

  saveData() {
    // let languagesList: Language[] = this.languageService.getAllLanguages();

    // this.http.put('https://live-languages-default-rtdb.firebaseio.com/languages.json', languagesList).subscribe(
    //   res => console.log(res)
    // );
  }

  fetchData() {
    // this.http.get<Language[]>('https://live-languages-default-rtdb.firebaseio.com/languages.json'
    // ).pipe(
    //   tap((langusgesList: Language[]) => {
    //     this.languageService.updateLanguages(langusgesList);
    //   })
    // ).subscribe();
  }
}
