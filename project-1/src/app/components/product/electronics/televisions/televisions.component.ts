import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-televisions',
  templateUrl: './televisions.component.html',
  styleUrls: ['./televisions.component.css']
})
export class TelevisionsComponent implements OnInit {

  categories: any[] = [];
  tvCategory: any[] = [];
  televisions: any[] = [];

  constructor(private bacendService: BackEndService, private router: Router, private productService: ProductService) {
    
    this.bacendService.getAllCategories().subscribe(
      res => {
        this.categories = res as Array<any>;
        console.log(this.categories);
        this.tvCategory = this.categories.filter(category => category.name == "televisions");
        console.log(this.tvCategory);

        this.bacendService.getCategoryProducts(this.tvCategory[0]._id).subscribe(
          res => {
            this.televisions = res as Array<any>
            console.log(this.televisions);
          }
        );
      }
    );
  }

  ngOnInit(): void {
  }

  showProduct(product: any) {
    this.productService.setProduct(product);
    this.router.navigate(['/product']);
  }

}
