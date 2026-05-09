import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../model/category';

@Component({
  selector: 'app-filter-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-category.component.html',
  styleUrl: './filter-category.component.css'
})
export class FilterCategoryComponent {
    @Output() categoryChange = new EventEmitter<string>();
 
  selectedCategory = 'all';
 
  @Input( { required: true } ) categorys!: Category[];
 
  selectCategory(value: string): void {
    this.selectedCategory = value;
    this.categoryChange.emit(value);
  }

}
