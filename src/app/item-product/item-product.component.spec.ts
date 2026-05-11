import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemProductComponent } from './item-product.component';

describe('ItemProductComponent', () => {
  let component: ItemProductComponent;
  let fixture: ComponentFixture<ItemProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemProductComponent);
    component = fixture.componentInstance;
    component.product = { id: '1', brand: 'Test', model: 'Test', price: 10, stock: 1, imageUrl: 'test.jpg', description: 'test', categoryId: '1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
