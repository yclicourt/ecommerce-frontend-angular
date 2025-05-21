import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModalUpdatedComponent } from './product-modal-updated.component';

describe('ProductModalUpdatedComponent', () => {
  let component: ProductModalUpdatedComponent;
  let fixture: ComponentFixture<ProductModalUpdatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModalUpdatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModalUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
