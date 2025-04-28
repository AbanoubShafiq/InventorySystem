import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5><i class="fas fa-store-alt me-2"></i>Branch Information</h5>
            <p><i class="fas fa-map-marker-alt me-2"></i>Main Store - Luxury Perfumes</p>
            <p><i class="fas fa-clock me-2"></i>Operating Hours: 9AM - 10PM</p>
            <p><i class="fas fa-phone-alt me-2"></i>Store: (555) 123-4567</p>
          </div>
          <div class="col-md-4">
            <h5><i class="fas fa-bolt me-2"></i>Quick Access</h5>
            <ul class="list-unstyled">
              <li><a href="#"><i class="fas fa-chart-line me-2"></i>Daily Sales Report</a></li>
              <li><a href="#"><i class="fas fa-boxes me-2"></i>Inventory Status</a></li>
              <li><a href="#"><i class="fas fa-exchange-alt me-2"></i>Stock Transfer</a></li>
              <li><a href="#"><i class="fas fa-headset me-2"></i>Support Center</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5><i class="fas fa-life-ring me-2"></i>Support Contacts</h5>
            <ul class="list-unstyled">
              <li><i class="fas fa-phone me-2"></i>Help Desk: 555-0123</li>
              <li><i class="fas fa-user-shield me-2"></i>Store Manager: 555-0124</li>
              <li><i class="fas fa-tools me-2"></i>Technical Support: 555-0125</li>
              <li><i class="fas fa-ambulance me-2"></i>Emergency: 555-0126</li>
            </ul>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <div class="footer-bottom text-center">
              <p class="mb-0">© 2024 Sales Clerk Portal - Luxury Perfumes | All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(180deg, #00004d 0%, #000066 100%);
      color: white;
      padding: 2rem 0;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
    }

    .container {
      padding: 0 2rem;
    }

    h5 {
      color: #fff;
      font-weight: 600;
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    ul li {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
    }

    a:hover {
      color: white;
      transform: translateX(5px);
    }

    i {
      width: 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .footer-bottom {
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .footer {
        text-align: center;
      }
      
      .col-md-4 {
        margin-bottom: 2rem;
      }
    }
  `]
})
export class FooterComponent {}
