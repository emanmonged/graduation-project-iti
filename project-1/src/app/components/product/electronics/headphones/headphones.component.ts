import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-headphones',
  templateUrl: './headphones.component.html',
  styleUrls: ['./headphones.component.css']
})
export class HeadphonesComponent implements OnInit {

  categories: any[] = [];
  headphoneCategory: any[] = [];
  headphones: any[] = [];

  constructor(private bacendService: BackEndService, private router: Router, private productService: ProductService) { 
    this.bacendService.getAllCategories().subscribe(
      res => {
        this.categories = res as Array<any>;
        console.log(this.categories);
        this.headphoneCategory = this.categories.filter(category => category.name == "headphones");
        console.log(this.headphoneCategory);

        this.bacendService.getCategoryProducts(this.headphoneCategory[0]._id).subscribe(
          res => {
            this.headphones = res as Array<any>
            console.log(this.headphones);
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
