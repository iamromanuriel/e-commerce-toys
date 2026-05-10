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
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [TopBarComponentComponent, FilterCategoryComponent, BannerComponent, ItemProductComponent, ProductDialogComponent, CommonModule, LucideAngularModule],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent {
  categoryService = new CategoryService();
  productService = inject(ProductService);

  categorys: Category[] = [];
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  productSelected: Product | null = null;
  isDialogOpen = false;
  currentPage = 1;
  totalPages = 1;

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Math = Math;

  async ngOnInit(): Promise<void> {
    this.categoryService.getCategories$().subscribe(categories => {
      this.categorys = categories;
      console.log('Categorías cargadas:', this.categorys);
    });

    this.productService.getProducts$().subscribe(products => {
      console.log('Productos cargados:', products);
      this.products = products;
      this.totalPages = this.productService.getTotalPages(products.length);
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts(): void {
    this.paginatedProducts = this.productService.getPaginatedProducts(this.products);
    this.currentPage = this.productService.getCurrentPage();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.productService.setCurrentPage(this.currentPage - 1);
      this.updatePaginatedProducts();
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.productService.setCurrentPage(this.currentPage + 1);
      this.updatePaginatedProducts();
      this.scrollToTop();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.productService.setCurrentPage(page);
      this.updatePaginatedProducts();
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
