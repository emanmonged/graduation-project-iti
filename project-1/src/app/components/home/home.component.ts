import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  products: any[] = [];
  laptopsList: any[] = [];
  phonesList: any[] = [];
  tvsList: any[] = [];
  userLoged: boolean = false;

  responsiveOptions: any = [];

  constructor(private userService: UserService, private router: Router, private backendService: BackEndService, private messageService: MessageService, private productService: ProductService) {

    if (this.userService.getAdminId() != undefined) {
      this.router.navigate(['/admin']);
    }

    this.backendService.getAllProducts().subscribe(
      res => {
        
        this.products = res as Array<any>;

        if (this.products.length > 0) {
          this.laptopsList = this.products.filter(product => product.category.name == "laptops");
          this.phonesList = this.products.filter(product => product.category.name == "phones");
          this.tvsList = this.products.filter(product => product.category.name == "televisions");
        }
      }
    );

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    if (this.userService.getUserId() != undefined) {
      this.userLoged = true;
    }
  }

  showProduct(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product']);
  }

  rate() {
    if (this.userLoged) {

    } else {
      this.messageService.clear();
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Info', detail: 'Log in first', life: 1000 });
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }
}
