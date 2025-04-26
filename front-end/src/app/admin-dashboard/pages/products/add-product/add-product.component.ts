import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../_services/product.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../../_models/product.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';
import { CategoryService } from 'src/app/_services/category.service';
import { Category } from 'src/app/_models/category.model';



@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule,UploadComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  categories: Category[] = [];
  @Input() show = false;
  @Input() productData: Product ={
    _id: '',
    name: '',
    description: '',
    price: 0,
    prevPrice: 0,
    noOfSale: 0,
    images: [],
    isActive: true,
    quantity: 0,
    distributedItems: 0,
    sellerId: {_id:'679bd13b5503613c0a14eb9b',firstName:'',lastName:''},
    categoryId:  {_id:'',name:''},
    createdAt: new Date(),
    updatedAt: new Date()
  };
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  loading = false;


  constructor(private productService: ProductService , private toastr: ToastrService,private categoryService:CategoryService) {}
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategorierByActive().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => console.error('❌ Error fetching categories:', error)
    });
  }
  


  onImagesUploaded(imageUrls: string[]) {
    this.productData.images = imageUrls;
  }
  
  async onSubmit(): Promise<void> {
    try {
      this.loading = true;

      const productData:Product = {
        _id: '',
        name: this.productData.name?.trim() || '',
        description: this.productData.description?.trim() || '',
        price: this.productData.price ?? 0,
        prevPrice: this.productData.prevPrice ?? 0,
        noOfSale: this.productData.noOfSale ?? 0,
        images: this.productData.images ?? [],
        isActive: this.productData.isActive ?? true,
        quantity: this.productData.quantity ?? 0,
        distributedItems: this.productData.distributedItems ?? 0,
        sellerId: this.productData.sellerId|| '679bd13b5503613c0a14eb9b',
        categoryId: this.productData.categoryId || '',
        createdAt: this.productData.createdAt ?? new Date(),
        updatedAt: this.productData.updatedAt ?? new Date()
      };

      await firstValueFrom(this.productService.createProduct(this.productData));
      this.toastr.success('Product added successfully!', 'Success');
      this.saved.emit();
      this.close.emit();
    } catch (error) {
      console.error('Error adding product:', error);
      this.toastr.error('Failed to add product. Please try again.', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  removeImage(index: number) {
    this.productData.images.splice(index, 1);
  }

}
