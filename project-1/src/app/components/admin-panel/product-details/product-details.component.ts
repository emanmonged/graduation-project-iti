import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: any;

  constructor(private backendService: BackEndService) {
    this.product = this.backendService.getEditedProduct();
  }

  ngOnInit(): void {
  }

}
