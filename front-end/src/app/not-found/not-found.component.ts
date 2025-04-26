import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  loading: boolean = true; 
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulate a delay for the animation
    setTimeout(() => {
      this.loading = false; 
    }, 3000); 
}

goBackToCatalog(): void {
  this.router.navigate(['/catalog']);
}
}