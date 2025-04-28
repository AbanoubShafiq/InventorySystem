import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Order } from '../../../_models/order2.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OnlineOrderService } from '../../../_services/online-order.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DetailsOrderComponent } from './details-order/details-order.component';
import { ProductService } from 'src/app/_services/product.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,DetailsOrderComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent  implements OnInit, OnDestroy {
    orders: Order[] =[]
        filteredOrders: Order[] = [];
        loading = false;
        searchTerm: string = '';
        sortColumn: keyof Order = 'customerDetails';
        sortDirection: 'asc' | 'desc' = 'asc';
        statusFilter: 'all' | "pending" | "shipped" | "cancelled" | "refunded" = 'all';
        showAddModal = false;
        showDetailsModal = false;
        editingOrder?: Order;
        selectedFiles: File[] = [];
        error: string | null = null;
        private destroy$ = new Subject<void>();
        orderData: Order = this.getInitialOrderData();
        constructor(private onlineOrderService: OnlineOrderService , private cdr: ChangeDetectorRef,
        private productService:ProductService,private subInventoryService:SubInventoryService) {}
      
        ngOnInit(): void {
          this.loadOrders();
          this.subscribeToOrderUpdates();
        }
        getInitialOrderData(): Order {
          return {
                _id: '',
                customerId: '',
                items:[{subInventoryId: '',
                  _id:"",
                  price: 0,
                  productDetails:{_id:'',name:'',price:0,prevPrice:0,images:[],noOfSale:0,sellerId:{_id:'',firstName:'',lastName:''},categoryId:{_id:'',name:''}},

                  quantity: 0,}],
                totalPrice: 0,
                status: "pending",
                paymentMethod: "Cash",
                date: '',
                customerDetails: {
                  firstName: '',
                  lastName: '',
                  address: {
                    street: '',
                    city: '',
                    zipCode: '',
                  },
                  email: '',
                  phone: '',
                },
                notes: '',
              }}
              
        subscribeToOrderUpdates(): void {
          this.onlineOrderService.onOrderUpdate()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.loadOrders());
        }
    
        ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();
        }
    
      
        async loadOrders(): Promise<void> {
          this.loading = true;
          this.error = null;
          
          try {
            const data = await firstValueFrom(this.onlineOrderService.getAllOrders());
            this.orders =[...data]
            console.log(this.orders)
        
            this.filteredOrders = [...this.orders];
        
            this.applyFilters();
            this.cdr.detectChanges();
          } catch (error) {
            console.error('❌ Error loading Orders:', error);
            this.error = 'Failed to load Orders';
          } finally {
            this.loading = false;
            this.cdr.detectChanges();
          }
        }
        
    
        get pendingOrdersCount(): number {
          return this.orders.filter(order => order.status === 'pending').length;
        }
        get shippedOrdersCount(): number {
          return this.orders.filter(order => order.status === 'shipped').length;
        }
        get refundedOrdersCount(): number {
          return this.orders.filter(order => order.status === 'refunded').length;
        }
      
        get canceledOrdersCount(): number {
          return this.orders.filter(order => order.status === 'cancelled').length;
        }
      
    
        changeStatusOrder(id: string,status:string): void {
          this.onlineOrderService.changeOrderStatus(id,status).subscribe({
            next: () => {
              this.loadOrders();
            },
            error:(error) => console.error('❌ Error:', error)
          });
        } 
    
        applyFilters(): void {
          let filtered = [...this.orders];
      
          if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
              order.customerDetails.firstName.toLowerCase().includes(searchLower)||
              order.customerDetails?.lastName?.toLowerCase().includes(searchLower)
            );
          }
          if (this.statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === this.statusFilter);
        }
        
        filtered.sort((a, b) => {
          let aValue: any = a[this.sortColumn];
          let bValue: any = b[this.sortColumn];
      
          if (this.sortColumn === 'customerDetails') {
              aValue = a.customerDetails?.firstName || '';
              bValue = b.customerDetails?.firstName || '';
          }
      
          if (aValue == null || bValue == null) return 0;
      
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return typeof aValue === 'string'
              ? direction * aValue.localeCompare(String(bValue))
              : direction * ((aValue as number) - (bValue as number));
      });
      
      
          this.filteredOrders = [...filtered];
          this.cdr.detectChanges();
        }
      
        onSearch(): void {
          this.applyFilters();
        }
      
        onStatusFilterChange(): void {
          this.applyFilters();
        }
      
        sort(column: keyof Order): void {
          if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
          }
          this.applyFilters();
        }
        
          async openDetailsModal(order: Order): Promise<void> {
            this.editingOrder = order;
            this.orderData = { ...order };
          
            try {
              const subInventories = await Promise.all(
                this.orderData.items.map(item => this.subInventoryService.getSubInventoryById(item.subInventoryId).toPromise())
              );
          
              const productRequests = subInventories.map(subInventory => 
                subInventory ? this.productService.getProductById(subInventory.product._id).toPromise() : null
              );
          
              const products = await Promise.all(productRequests);

              this.orderData.items.forEach((item:any, index) => {
                item.productDetails = products[index];
              });
          
              this.showDetailsModal = true;
              console.log('✅ Loaded order details successfully');
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
