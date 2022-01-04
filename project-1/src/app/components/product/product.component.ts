import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService]
})
export class ProductComponent implements OnInit {

  userLoged: boolean = false;
  faHeart = faHeart;
  faCheck = faCheck;
  faTimes = faTimes;
  faClipboardList = faClipboardList;
  faInfoCircle = faInfoCircle;
  blockedDocument: boolean = false;
  category: any;
  relatedProducts: any[] = [];
  user: any;
  cartItem = {
    orderItems: [
      {
        quantity: '1',
        product: ''
      }
    ],
    firstName: 'firstName',
    lastName: 'lastName',
    governorate: 'governorate',
    city: 'city',
    area: 'area',
    street: 'street',
    locationType: 'locationType',
    phone: 'phone',
    totalPrice: '',
    shippingNote: 'shippingNote',
    status: 'cart',
    user: ''
  }
  orders: any[] = [];
  cartOrders: any[] = [];
  items: any[] = [];
  product: any;
  isAddedToCart: boolean = false;

  constructor(private userService: UserService, private router: Router, private backendService: BackEndService, private productService: ProductService, private messageService: MessageService) {

    this.product = this.productService.getProduct();
    console.log(this.product);

    this.category = this.product.category._id;
    this.backendService.getCategoryProducts(this.category).subscribe(
      res => {
        let result = res as Array<any>;
        this.relatedProducts = result.slice(0, 5);
        console.log(this.relatedProducts);

        for (let i = 0; i < this.relatedProducts.length; i++) {
          if (this.relatedProducts[i]._id == this.product._id) {
            this.relatedProducts.splice(i, 1);
          }
        }

        if (this.relatedProducts.length == 5) {
          this.relatedProducts.splice(4, 1);
        }


        // this.relatedProduct.forEach(product => {
        //   if (product._id == this.product._id)
        //   this.relatedProduct.;
        // });
      }
    );

    if (this.userService.getUserId() != undefined) {

      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {
        this.user = res;
        this.userLoged = true;

        this.backendService.getUserOrders(this.user._id).subscribe(
          res => {

            this.orders = res as Array<any>;

            this.cartOrders = this.orders.filter(order => order.status === "cart");

            this.isAddedToCart = this.cartOrders.find(cartOrder => cartOrder.orderItems[0].product._id == this.product._id);

            if (this.isAddedToCart) {
              let counter = 0;

              this.orders.forEach(order => {

                this.items.push(...order.orderItems);

                console.log(order);

                for (; counter < this.items.length; counter++) {
                  this.items[counter].orderId = order._id;
                }
              });
            }

            console.log(this.items);
          }
        );
      });
    }
  }

  ngOnInit(): void {
  }

  addToCart(product: any) {
    if (this.userLoged) {

      console.log(product);

      this.isAddedToCart = true;

      this.cartItem.orderItems[0].product = product._id;
      this.cartItem.totalPrice = `${this.product.price}`;
      this.cartItem.user = this.user._id;
      console.log(this.cartItem);

      this.backendService.addToCart(this.cartItem).subscribe(
        res => {
          this.messageService.add({ key: 'c', severity: 'success', summary: 'Done', detail: 'Added to Cart', life: 1000 });
          window.location.reload();
          // this.blockDocument();
          // setTimeout(() => {
          //   this.router.navigate(['/shopping-cart']);
          // }, 1000);
        }
      );

    } else {
      this.router.navigate(['/login']);
    }
  }

  removeFromCart(product: any) {

    let orderItem = this.items.find(item => item.product._id == product._id);

    this.backendService.deleteFormCart(orderItem.orderId).subscribe(
      res => {
        this.isAddedToCart = false;
        this.messageService.add({ key: 'c', severity: 'success', summary: 'Done', detail: 'Removed from Cart', life: 1000 });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    );
  }

  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 10000);
  }

}
