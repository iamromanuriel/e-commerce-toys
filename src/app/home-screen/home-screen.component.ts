import { Component, OnInit, inject } from '@angular/core';
import { TopBarComponentComponent } from '../top-bar-component/top-bar-component.component';
import { FilterCategoryComponent } from '../filter-category/filter-category.component';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';
import { BannerComponent } from '../banner/banner.component';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Category } from '../model/category';
import { ItemProductComponent } from '../item-product/item-product.component';
import { Product } from '../model/produt';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChevronLeft, ChevronRight } from 'lucide-angular';
import { FooterComponent } from "../footer/footer.component";
import { Console } from 'node:console';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [TopBarComponentComponent, FilterCategoryComponent, BannerComponent, ItemProductComponent, ProductDialogComponent, CartDialogComponent, CommonModule, LucideAngularModule, FooterComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categorys: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  productSelected: Product | null = null;
  isDialogOpen = false;
  isCartOpen = false;
  currentPage = 1;
  totalPages = 1;
  selectedCategory = 'all';
  searchTerm = '';
  readonly itemsPerPage = this.productService.getItemsPerPage();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Math = Math;

  ngOnInit(): void {
    /*this.categoryService.getCategories$().subscribe((categories) => {
      this.categorys = categories;
    });*/
    this.categoryService.getAllCategories$().subscribe((categories) => {
      this.categorys = categories;
    });

    /*this.productService.getProducts$().subscribe((products) => {
      this.products = products;
      this.filterProducts();
    });*/

    this.productService.getAllProducts$().subscribe((products) => {
      this.products = products;
      this.filterProducts();
    })
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.productService.setCurrentPage(1);
    this.filterProducts();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.productService.setCurrentPage(1);
    this.filterProducts();
  }

  openProductDialog(product: Product): void {
    this.productSelected = product;
    this.isDialogOpen = true;
  }

  openCartDialog(): void {
    this.isCartOpen = true;
  }

  handleAddToCart(product: Product): void {
    if (product.id) {
      this.cartService.addToCart(product.id, 1);
    }
  }

  handleAddToCartFromDialog(data: { product: Product; quantity: number }): void {
    if (data.product.id) {
      this.cartService.addToCart(data.product.id, data.quantity);
    }
  }

  updatePaginatedProducts(): void {
    const current = this.productService.getCurrentPage();
    const validPage = Math.max(1, Math.min(current, this.totalPages));
    if (validPage !== current) {
      this.productService.setCurrentPage(validPage);
    }
    this.currentPage = validPage;
    this.paginatedProducts = this.productService.getPaginatedProducts(this.filteredProducts);
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

  selectedCategoryLabel(): string {
    if (this.selectedCategory.trim().toLowerCase() === 'all') {
      return 'Todas las categorías';
    }
    const categoryId = this.selectedCategory.trim().toLowerCase();
    const found = this.categorys.find((c) => c.id?.trim().toLowerCase() === categoryId);
    return found?.name ?? this.selectedCategory;
  }

  private filterProducts(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    const normalizedCategory = this.selectedCategory.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const productCategory = product.categoryId?.trim().toLowerCase() ?? '';
      const matchesCategory = normalizedCategory === 'all' || productCategory === normalizedCategory;
      const matchesSearch = !normalizedSearch || [
        product.description,
        product.model,
        product.brand,
      ].some(value => value?.toLowerCase().includes(normalizedSearch));
      return matchesCategory && matchesSearch;
    });

    this.totalPages = Math.max(1, this.productService.getTotalPages(this.filteredProducts.length));
    this.updatePaginatedProducts();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
