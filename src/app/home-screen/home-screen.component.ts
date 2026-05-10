import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { TopBarComponentComponent } from '../top-bar-component/top-bar-component.component';
import { FilterCategoryComponent } from '../filter-category/filter-category.component';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { BannerComponent } from '../banner/banner.component';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Category } from '../model/category';
import { ItemProductComponent } from '../item-product/item-product.component';
import { Product } from '../model/produt';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [TopBarComponentComponent, FilterCategoryComponent, BannerComponent, ItemProductComponent, ProductDialogComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent {
  categoryService = new CategoryService();
  productService = inject(ProductService);

  categorys: Category[] = [];
  products: Product[] = [];
  productSelected: Product | null = null;
  isDialogOpen = false;


  async ngOnInit(): Promise<void> {
    //this.productService.guardarProductosEnFirebase();

    this.categoryService.getCategories$().subscribe(categories => {
      this.categorys = categories;
      console.log('Categorías cargadas:', this.categorys);
    });

    this.productService.getProducts$().subscribe(products => {
      console.log('Productos cargados:', products);
      this.products = products;
    });
  }
}
