import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Category } from '../../../_models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../_services/category.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
@Component({
  selector: 'app-category',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,AddCategoryComponent,EditCategoryComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, OnDestroy{
  categories: Category[] =[]
      filteredCategories: Category[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof Category = 'name';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'active' | 'inactive' = 'all';
      showAddModal = false;
      showEditModal = false;
      editingCategory?: Category;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      categoryData: Category = this.getInitialCategoryData();
      constructor(private categoryService: CategoryService , private cdr: ChangeDetectorRef) {}
    
      ngOnInit(): void {
        this.loadCategories();
        this.subscribeToCategoryUpdates();
      }
      getInitialCategoryData(): Category {
        return {
          _id: '',
          name:'',
          description:'',
          image:[],
          isActive:true,
          createdAt:new Date()
        };
      }
      subscribeToCategoryUpdates(): void {
        this.categoryService.onCategoryUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadCategories());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadCategories(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.categoryService.getAllCategorier());
          this.categories =[...data]
      
          this.filteredCategories = [...this.categories];
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading categories:', error);
          this.error = 'Failed to load categories';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
      
  
      get activeCategriesCount(): number {
        return this.categories.filter(category => category.isActive === true).length;
      }
    
      get inactiveCategoriesCount(): number {
        return this.categories.filter(category => category.isActive === false).length;
      }
    
    
      deleteCategory(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.categoryService.deleteCategory(id).subscribe({
              next: () => {
                this.loadCategories();
                Swal.fire('Deleted!', 'category has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting category:', error);
                Swal.fire('Error!', 'Failed to delete category.', 'error');
              }
            });
          }
        });
      }
  
      toggleCategoryStatus(id:string) {
        this.categoryService.toggleStatusCategory(id).subscribe({
            next: () => {
              this.loadCategories();
            },
            error:(error) => console.error('❌ Error:', error)
          });
      }
      
    
      applyFilters(): void {
        let filtered = [...this.categories];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(category => 
            category.name.toLowerCase().includes(searchLower) 
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(category => 
            category.isActive === (this.statusFilter === 'active')
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredCategories = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof Category): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      
        openAddModal(): void {
          this.categoryData = this.getInitialCategoryData();
          this.showAddModal = true;
        }
      
        openEditModal(category: Category): void {
          this.editingCategory = category;
          this.categoryData = { ...category };
          this.showEditModal = true;
        }
      
        onCategorySaved(): void {
          this.loadCategories();
          this.showAddModal = false;
        }
      
        onCategoryUpdated(): void {
          this.showEditModal = false;
          this.loadCategories();
        }
}
