import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from './../../product.service';
import { CategoriesService } from './../../categories.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product: any = {};
  id: string;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private categoryService: CategoriesService,
    private productService: ProductService
  ) {  }

  save(product) {
    if (this.id)
      this.productService.update(this.id, product);
    else
      this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product ?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getAll();
    this.id = this.activeRoute.snapshot.paramMap.get('id');

    if (this.id) {
      this.productService.get(this.id)
      .subscribe(p => { this.product = { key: this.id, ...p }; });
    }
  }
}
