import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-mobiles',
  templateUrl: './mobiles.component.html',
  styleUrls: ['./mobiles.component.css']
})
export class MobilesComponent implements OnInit {

  categories: any[] = [];
  mobileCategory: any[] = [];
  mobiles: any[] = [];

  constructor(private bacendService: BackEndService, private router: Router, private productService: ProductService) {

    this.bacendService.getAllCategories().subscribe(
      res => {
        this.categories = res as Array<any>;
        console.log(this.categories);
        this.mobileCategory = this.categories.filter(category => category.name == "phones");
        console.log(this.mobileCategory);

        this.bacendService.getCategoryProducts(this.mobileCategory[0]._id).subscribe(
          res => {
            this.mobiles = res as Array<any>
            console.log(this.mobiles);
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
