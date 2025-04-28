import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SubInventoryServicesService } from '../_services/sub-inventory.services.service';
import { CategoryService } from '../_services/category.service';
import { CartService } from '../cart/service/cart.service';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';


interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: Review[];
  inStock: boolean; 
  inStockAmount: number; 
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  perfume: Perfume | null = null; // Current perfume details
  loading: boolean = true; // Loading state
  Array = Array;
  Math = Math;

  // User input fields
  userRating: number = 0; // Selected rating
  userComment: string = ''; // Comment text
  quantity: number = 0; // Default quantity

  // Static perfume data (replace with API call in a real app)
  private perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Eternity',
      price: 79.99,
      image: '',
      description: 'A timeless classic with floral and musk notes.',
      category: 'floral', // You can adjust the category based on your preference or keep it based on the original (e.g. 'men' or 'unisex').
      rating: 4.5,
      reviews: [
        { id: 1, customerName: 'John Doe', rating: 5, comment: 'Absolutely love this fragrance! It lasts all day.' },
        { id: 2, customerName: 'Jane Smith', rating: 4, comment: 'Great scent, but a bit too strong for summer.' }
      ],
      inStock: true,
      inStockAmount: 10
    },
    {
      id: 2,
      name: 'Ocean Breeze',
      price: 69.99,
      image: '',
      description: 'Fresh and invigorating with citrus and marine notes.',
      category: 'citrus', // Adjusted from 'woman' to a more fitting category 'citrus'.
      rating: 4.0,
      reviews: [
        { id: 1, customerName: 'Alice Johnson', rating: 4, comment: 'Perfect for summer days!' },
        { id: 2, customerName: 'Bob Brown', rating: 3, comment: 'Nice, but not my favorite.' }
      ],
      inStock: false,
      inStockAmount: 0
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: '',
      description: 'A deep and mysterious fragrance with notes of jasmine and sandalwood.',
      category: 'floral', // Choose category based on preference, or align with the original 'unisex'.
      rating: 4.2,
      reviews: [
        { id: 1, customerName: 'Chris White', rating: 4, comment: 'Such a unique scent, great for evening wear.' },
        { id: 2, customerName: 'Debbie Black', rating: 4, comment: 'Beautiful scent, though a bit heavy for the day.' }
      ],
      inStock: true,
      inStockAmount: 15
    },
    {
      id: 4,
      name: 'Spring Essence',
      price: 59.99,
      image: '',
      description: 'A light and airy fragrance with floral and green notes.',
      category: 'floral', // Adjusted from 'men' to 'floral' for relevance.
      rating: 4.3,
      reviews: [
        { id: 1, customerName: 'Tom Harris', rating: 5, comment: 'Perfect for the spring season, very fresh!' },
        { id: 2, customerName: 'Emily Green', rating: 4, comment: 'Lovely floral scent, but a bit subtle for me.' }
      ],
      inStock: true,
      inStockAmount: 20
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: '',
      description: 'A captivating fragrance with rich vanilla and amber notes.',
      category: 'oriental', // You can set the category to 'oriental' or 'warm' based on the fragrance's nature.
      rating: 4.7,
      reviews: [
        { id: 1, customerName: 'David Blue', rating: 5, comment: 'Such a warm and comforting scent. My new favorite!' },
        { id: 2, customerName: 'Sophia Red', rating: 4, comment: 'Rich and sensual, but a bit strong for daily wear.' }
      ],
      inStock: true,
      inStockAmount: 12
    }
  ];
  

  constructor(private route: ActivatedRoute,
    private router: Router,
    public subInventorySer:SubInventoryServicesService,
    private categorySer:CategoryService,
    private cartSer:CartService,
    private authSer:AuthServiceService,
    private cookieSer:CookieService
  ) {}
  
  public productId:any;
  public product:any;
  public userData:any;
  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 500);
     this.productId = this.route.snapshot.paramMap.get('id');

    this.subInventorySer.getSubInventoryById(this.productId).subscribe({
      next: (data) => {
        const categoryId = data.product.categoryId;

        
        // Fetch the category information
        this.categorySer.getCategoryById(categoryId).subscribe({
          next: (categoryData) => {
            this.product = {
              productName: data.product.name,
              productPrice: data.product.price,
              productDescription: data.product.description,
              productImage: data.product.images,
              productCategory: categoryData.name, 
              productQuantity: data.quantity,
              noOfSale: data.numberOfSales,
              inStock: data.quantity == 0 ? false : true,
              _id: data._id
            };
          },
          error: (err) => {
            console.error('Failed to retrieve category', err);
          }
        });
      },
      error: (err) => {
        
      }
    });

    // this.authSer.getUserDataByEmail().subscribe({
    //   next: (data) => {
    //     this.userData = data;
    //   },
    //   error: (err) => { 
    //     console.error('Failed to retrieve user data', err);
    //   }
    // });
    



  }

  // Set user rating when a star is clicked
  setRating(rating: number): void {
    this.userRating = rating;
  }

  // Submit the review
  submitReview(): void {
    if (!this.perfume) return;
    // Generate a new review object
    const newReview: Review = {
      id: this.perfume.reviews.length + 1, // Simple ID generation
      customerName: 'Anonymous', // Replace with actual user name if logged in
      rating: this.userRating,
      comment: this.userComment
    };
    // Add the review to the perfume's reviews array
    this.perfume.reviews.push(newReview);
    // Update the average rating
    const totalRatings = this.perfume.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.perfume.rating = totalRatings / this.perfume.reviews.length;
    // Reset form fields
    this.userRating = 0;
    this.userComment = '';
    // Alert success message
    alert('Thank you for your review!');
  }

  increaseQuantity(): void {
    if (!this.product) {
      console.error('Perfume object is null or undefined');
      return;
    }
    if (this.product.productQuantity === 0) {
      alert('This product is out of stock.');
      return;
    }
  
    if (this.quantity < this.product.productQuantity) {
      this.quantity++;
      console.log('Increased quantity to:', this.quantity);
    } else {
      alert(`Sorry, only ${this.product.productQuantity} units are available in stock.`);
    }

  }
  

  // Decrease the quantity
decreaseQuantity(): void {
  if (this.quantity > 0) {
    this.quantity--;
  }
}
  
  // Add the product to the cart
// addToCart(): void {
//   if (this.cookieSer.check("token"))
//   {
//     console.log(this.cookieSer.get("token"))
//     let token = this.cookieSer.get("token");
//     this.authSer.decodeToken(token).subscribe({
//       next: (claims:any) => {
//         this.cartSer.addToCart(claims.sub, this.product._id, this.quantity).subscribe({
//           next: (data) => {
//             alert('Added to cart successfully!');
//           },
//           error: (err) => {
//             console.error('Failed to add to cart', err);
//           }     
//       })
//     }
//   })
//   }
//   else  {
//     this.cartSer.addToCart("", this.product._id, this.quantity).subscribe({
//       next: (data) => {
//         alert('Added to cart successfully!');
//       },
//       error: (err) => {
//         console.error('Failed to add to cart', err);
//       }     
//   })

//   }
  
//   // this.cartSer.addToCart()

  
//   // Show a more detailed alert message
//   // const totalCost = this.quantity * this.perfume.price;
//   // alert(`"${this.perfume.name}" (Quantity: ${this.quantity}, Total: $${totalCost.toFixed(2)}) has been added to your cart!`);
  
// }


addToCart(): void {
  if (this.cookieSer.check("token")) {
    console.log(this.cookieSer.get("token"));
    let token = this.cookieSer.get("token");
    this.authSer.decodeToken(token).subscribe({
      next: (claims: any) => {
        this.cartSer.addToCart(claims.sub, this.product._id, this.quantity).subscribe({
          next: (data) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Added to cart successfully!',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            console.error('Failed to add to cart', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add to cart',
              confirmButtonText: 'OK'
            });
          }
        });
      },
      error: (err) => {
        console.error('Failed to decode token', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to decode token',
          confirmButtonText: 'OK'
        });
      }
    });
  } else {
    this.cartSer.addToCart("", this.product._id, this.quantity).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Added to cart successfully!',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add to cart',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}


goBackToCatalog(): void {
  this.router.navigate(['/catalog']);
}

}

