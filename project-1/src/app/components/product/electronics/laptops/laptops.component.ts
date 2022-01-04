import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-laptops',
  templateUrl: './laptops.component.html',
  styleUrls: ['./laptops.component.css']
})
export class LaptopsComponent implements OnInit {

  categories: any[] = [];
  laptopCategory: any[] = [];
  laptops: any[] = [];

  constructor(private bacendService: BackEndService, private router: Router, private productService: ProductService) { 

    this.bacendService.getAllCategories().subscribe(
      res => {
        this.categories = res as Array<any>;
        console.log(this.categories);
        this.laptopCategory = this.categories.filter(category => category.name == "laptops");
        console.log(this.laptopCategory);

        this.bacendService.getCategoryProducts(this.laptopCategory[0]._id).subscribe(
          res => {
            this.laptops = res as Array<any>
            console.log(this.laptops);
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
