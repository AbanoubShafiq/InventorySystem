import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SubInventoryServicesService } from '../_services/sub-inventory.services.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../_services/auth-service.service';
import { SubInventoryService } from '../_services/sub-inventory.service';
import { CategoryService } from '../_services/category.service';
import {  HostListener } from '@angular/core';


interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;

}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports:[CommonModule,RouterLink],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  showBackToTop: boolean = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Show the button if the user has scrolled more than 300px
    this.showBackToTop = window.pageYOffset > 300;
  }

  scrollToTop(): void {
    // Smoothly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  constructor(
    private router: Router,
    public subInventorySer: SubInventoryService,
    private categorySer:CategoryService,
    public cookieServices:CookieService,
    public authSer: AuthServiceService,
  
    

  ) {}

  token:any=null ;
  productRelatedtoBranch:any[]=[];
  products:any[] = [];
   loading: boolean = true; 
   bestSales: any[] = []; 
   newArrivalsD: any[] = []; 

  
  

  // ngOnInit(): void {
  //   this.authSer.decodeToken(this.getToken()).subscribe({
  //     next: (data) => {
  //       this.token = data;
  //       this.fetchProducts();
  //               console.log(this.productRelatedtoBranch);

  //     },
  //     error: (err) => {
  //       console.error('Error fetching token:', err);
  //       // this.loading = false;
  //     }
  //   });

  // }
  
  // private fetchProducts(): void {
  //   const branchId = this.authSer.isAuthenticated() && this.token.branchId
  //     ? this.token.branchId
  //     : '67b129216e1b912065196f93';
  
  //   this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.productRelatedtoBranch = data;
        
  //       const categoryRequests = this.productRelatedtoBranch.map(prod =>
  //         this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
  //       );
  
  //       Promise.all(categoryRequests).then(categories => {
  //         this.products = this.productRelatedtoBranch.map((prod, index) => ({
  //           productName: prod.product.name,
  //           productPrice: prod.product.price,
  //           productDescription: prod.product.description,
  //           productImage: prod.product.images,
  //           productCategory: categories[index]?.name,
  //           productQuantity: prod.quantity,
  //           noOfSale: prod.numberOfSales,
  //           subInventoryDate: prod.lastUpdated,
  //           _id: prod._id
  //         }));
  //         console.log(this.products); 

  //         // Filter and sort for bestSales (top 4 by noOfSale)
  //         this.bestSales = this.products
  //         .sort((a, b) => b.noOfSale - a.noOfSale) 
  //         .slice(0, 4); 

  //         // Filter and sort for newArrivals (top 4 by subInventoryDate)
  //         this.newArrivals = this.products
  //           .sort((a, b) => new Date(b.subInventoryDate).getTime() - new Date(a.subInventoryDate).getTime()) 
  //           .slice(0, 4); 

  //         console.log('Best Sales:', this.bestSales);
  //         console.log('New Arrivals:', this.newArrivals);

  //         this.loading = false;
  //       }).catch(error => {
  //         console.error('Failed to retrieve categories', error);
  //       });
        

  //     },
  //     error: (err) => {
  //       console.error('Error fetching products:', err);
  //       this.loading = false; 
  //     }
  //   });
  // }

  
  
  
  


  // Static perfume data
  
  
  
  async ngOnInit(): Promise<void> {
    try {
      this.token = await this.authSer.decodeToken(this.getToken()).toPromise();
      await this.fetchProducts();
      console.log(this.products); 
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  }
  
  private async fetchProducts(): Promise<void> {
    try {
      const branchId = this.authSer.isAuthenticated() && this.token.branchId
        ? this.token.branchId
        : '67b129216e1b912065196f93';
  
      this.productRelatedtoBranch = await this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).toPromise() ?? [];
  
      const categoryRequests = this.productRelatedtoBranch.map(prod =>
        this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
      );
  
      const categories = await Promise.all(categoryRequests);
  
      this.products = this.productRelatedtoBranch.map((prod, index) => ({
        productName: prod.product.name,
        productPrice: prod.product.price,
        productDescription: prod.product.description,
        productImage: prod.product.images,
        productCategory: categories[index]?.name,
        productQuantity: prod.quantity,
        noOfSale: prod.numberOfSales,
        subInventoryDate: prod.lastUpdated,
        _id: prod._id
      }));
  
      console.log(this.products); 
      // Filter and sort for bestSales (top 4 by noOfSale)
      this.bestSales = this.products
      .sort((a, b) => b.noOfSale - a.noOfSale) 
      .slice(0, 4); 

      // Filter and sort for newArrivals (top 4 by subInventoryDate)
      this.newArrivalsD = this.products
        .sort((a, b) => new Date(b.subInventoryDate).getTime() - new Date(a.subInventoryDate).getTime()) 
        .slice(0, 4);
        
        console.log('Best Sales:', this.bestSales);
        console.log('New Arrivals:', this.newArrivalsD);
      this.loading = false;
    } catch (error) {
      console.error('Failed to retrieve products or categories', error);
      this.loading = false;
    }
  }
  perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Eternity',
      price: 79.99,
      image: '',
      description: 'A timeless classic with floral and musk notes.',
      rating: 5


    },
    {
      id: 2,
      name: 'Ocean Breeze',
      price: 69.99,
      image: '',
      description: 'Fresh and invigorating with citrus and marine notes.',
      rating: 4
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: '',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 3
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: '',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 5
    }
  ];

   brands = [
    { name: 'Chanel', imgPath: 'assets/brands/channel.jpeg' },
    { name: 'Dior', imgPath: 'assets/brands/dior2.png' },
    { name: 'YSL', imgPath: 'assets/brands/ysl.jpeg' },
    { name: 'Tom Ford', imgPath: 'assets/brands/tomford.jpeg' },
    { name: 'Gucci', imgPath: 'assets/brands/gucci.jpeg' },
    { name: 'Versace', imgPath: 'assets/brands/vercase.jpeg' }
  ];

  // Static review data
  reviews: Review[] = [
    {
      id: 1,
      customerName: 'John Doe',
      rating: 5,
      comment: 'Absolutely love this fragrance! It lasts all day.'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Great scent, but a bit too strong for summer.'
    },
    {
      id: 3,
      customerName: 'Jane Doe',
      rating: 3,
      comment: 'good scent.'
    }
  ];

  // Static category data
  categories: Category[] = [
    { id: 1, name: 'Men', image: 'assets/category/men.jpeg' },
    { id: 2, name: 'Women', image: 'assets/category/women.jpeg' },
    { id: 3, name: 'Unisex', image: 'assets/category/unisex.jpeg' }
  ];
  

  // Static new arrivals data
  // newArrivals: Perfume[] = [
  //   {
  //     id: 4,
  //     name: 'Spring Essence',
  //     price: 59.99,
  //     image: '',
  //     description: 'A fresh and floral scent perfect for spring.',
  //     rating: 5
  //   },
  //   {
  //     id: 5,
  //     name: 'Night Mist',
  //     price: 99.99,
  //     image: '',
  //     description: 'A luxurious fragrance for evening wear.',
  //     rating: 5
  //   },
  //   {
  //     id: 5,
  //     name: 'Night Mist',
  //     price: 99.99,
  //     image: '',
  //     description: 'A luxurious fragrance for evening wear.',
  //     rating: 5
  //   },
  //   {
  //     id: 5,
  //     name: 'Night Mist',
  //     price: 99.99,
  //     image: '',
  //     description: 'A luxurious fragrance for evening wear.',
  //     rating: 5
  //   }
  // ];

  // Static blog post data
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Art of Choosing the Right Fragrance',
      excerpt: 'Learn how to select a perfume that matches your personality and occasion.',
      image: 'assets/tips/choose.jpeg',
    },
    {
      id: 2,
      title: 'Top 5 Perfumes for Summer 2023',
      excerpt: 'Discover the best fragrances to keep you fresh this summer.',
      image: 'assets/tips/summer3.jpeg',
    }
  ];

  
  Array = Array;
  goBackToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
  goBackToDetails(id:any): void {
    this.router.navigate(['/catalog/details',id]);
  }
  goBackToCategory(category:string): void {
    this.router.navigate(['/catalog'], { queryParams: { category } });
    }
  goBackToUserReg(): void {
    this.router.navigate(['/user/register']);
  }

  getToken(): string {
    return this.cookieServices.get('token'); 
  }

  decodeUserToken(token: string): any {
    try {
      const decoded = this.authSer.decodeToken(token);
      console.log('Decoded Token:', decoded); // Log the decoded token
      return decoded;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
}