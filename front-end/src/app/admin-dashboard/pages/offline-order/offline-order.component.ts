import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { OrderOffline } from '../../../_models/orderOffline.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderOfflineService } from '../../../_services/order-offline.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DetailsOfflineOrderComponent } from './details-offline-order/details-offline-order.component';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-offline-order',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,DetailsOfflineOrderComponent],
  templateUrl: './offline-order.component.html',
  styleUrl: './offline-order.component.css'
})
export class OfflineOrderComponent implements OnInit, OnDestroy{
  branchId=''
  orderOfflines: OrderOffline[] =[]
      filteredOrderOfflines: OrderOffline[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof OrderOffline = 'date';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'completed' | 'canceled' = 'all';
      showAddModal = false;
      showDetailsModal = false;
      editingOrderOffline?: OrderOffline;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      orderOfflineData: OrderOffline = this.getInitialOrderOfflineData();
      constructor(private orderOfflineService: OrderOfflineService , private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,private productService:ProductService) {}
    
      ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.branchId = params.get('_id') || '';
          if (this.branchId) {
            this.loadOrderOfflines();
          }
        });
        this.subscribeToOrderOfflineUpdates();
      }
      getInitialOrderOfflineData(): OrderOffline {
        return {
            _id:'',
            items:[{
              _id: '',
              subInventoryId:{
                product: '',
              },
              price: 0,
              quantity: 0,
              productDetails:{_id:'',name:'',price:0,prevPrice:0,images:[],noOfSale:0,sellerId:{_id:'',firstName:'',lastName:''},categoryId:{_id:'',name:''}}
            }],
            totalPrice: 0,
            date:new Date(),
            branch: {
              _id: '',
              branchName: '',
            },
            status: 'completed',

        };
      }
      subscribeToOrderOfflineUpdates(): void {
        this.orderOfflineService.onOrderOfflineUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadOrderOfflines());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadOrderOfflines(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.orderOfflineService.getOfflineOrdersByBranchId(this.branchId));
          this.orderOfflines =[...data]
      
          this.filteredOrderOfflines = [...this.orderOfflines];
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading OrderOfflines:', error);
          this.error = 'Failed to load OrderOfflines';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
      
  
      get completedOrderOfflinesCount(): number {
        return this.orderOfflines.filter(orderOffline => orderOffline.status === 'completed').length;
      }
    
      get canceledOrderOfflinesCount(): number {
        return this.orderOfflines.filter(orderOffline => orderOffline.status === 'canceled').length;
      }
    
  
      cancelOrderOffline(id: string): void {
        this.orderOfflineService.cancelOfflineOrder(id).subscribe({
          next: () => {
            this.loadOrderOfflines();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      } 
  
      applyFilters(): void {
        let filtered = [...this.orderOfflines];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(orderOffline => 
            new Date(orderOffline.date).toLocaleDateString().toLowerCase().includes(searchLower)
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(orderOffline => 
            orderOffline.status === this.statusFilter
          );
        }
        
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredOrderOfflines = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof OrderOffline): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      
        // openDetailsModal(): void {
        //   this.orderOfflineData = this.getInitialOrderOfflineData();
        //   this.showAddModal = true;
        // }
      
        async openDetailsModal(orderOffline: OrderOffline): Promise<void> {
          this.editingOrderOffline = orderOffline;
          this.orderOfflineData = { ...orderOffline };
        
          try {
            // تنفيذ جميع طلبات المنتجات بشكل متوازي
            const productRequests = this.orderOfflineData.items.map(item =>
              this.productService.getProductById(item.subInventoryId.product).toPromise()
            );
        
            // انتظار كل الطلبات مع بعض
            const products = await Promise.all(productRequests);
        
            // ربط المنتجات بالعناصر
            this.orderOfflineData.items.forEach((item:any, index) => {
              item.productDetails = products[index];
            });
        
            this.showDetailsModal = true;
            console.log('✅ Order details loaded successfully');
          } catch (error) {
            console.error('❌ Error loading order details:', error);
          }
        }
        
      
        // onUserSaved(): void {
        //   this.loadUsers();
        //   this.showAddModal = false;
        // }
      
        // onUserUpdated(): void {
        //   this.showEditModal = false;
        //   this.loadUsers();
        // }
}
