import { Component, OnInit } from '@angular/core';
import { Complaint } from 'src/app/_models/contact.model';
import { ContactService } from 'src/app/_services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from 'src/app/_services/auth-service.service';

@Component({
  selector: 'app-user-complaints',
  imports: [CommonModule],
  templateUrl: './user-complaints.component.html',
  styleUrl: './user-complaints.component.css'
})
export class UserComplaintsComponent implements OnInit {

  noOfComplaints:number = 0;
  userComplaints:Complaint[] = [];
  id:any;

  constructor(
    private compliant: ContactService,
    private route: ActivatedRoute,
    private authSer: AuthServiceService,
    private router: Router
  ) { }


    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.id = params['id'];
        this.loadUserComplaints();
      });
    }
  



  
  // load complaints
  loadUserComplaints() {
    this.compliant.getComplaintsByUser(this.id).subscribe({
      next: (complaints) => {
        this.noOfComplaints = complaints.length;
        this.userComplaints = complaints
        console.log(complaints);
      },
      error: (err) => {
        if (err.status == 401) {
          this.authSer.logout();
          this.router.navigateByUrl("user/login");

        } 
        console.error('Error fetching complaints', err);
      }
    });
  }


  viewComplaint(complaint:Complaint) {
    // console.log(complaint); 
    const complaintDetails = `
      <div style="text-align: left;">
        <h5 class="text-primary"><strong>Complaint ID:</strong> ${complaint._id}</h5>
        <hr>
  
        <h6 class="fw-bold">🧑 User Details</h6>
        <div class="p-2 bg-light rounded">
          <p><strong>Name:</strong> ${complaint.user ? `${complaint.user.firstName} ${complaint.user.lastName}` : '<span class="text-muted">N/A</span>'}</p>
          <p><strong>Email:</strong> <a href="mailto:${complaint.user ? complaint.user.email : complaint.email}" class="text-decoration-none">${complaint.user ? complaint.user.email : complaint.email}</a></p>
        </div>
  
        <h6 class="fw-bold mt-3">📌 Complaint Information</h6>
        <div class="p-2 bg-light rounded">
          <p><strong>Subject:</strong> ${complaint.subject}</p>
          <p><strong>Description:</strong> <span class="d-block border p-2 rounded bg-white">${complaint.description}</span></p>
          <p><strong>Status:</strong> <span class="badge bg-${complaint.status === 'Resolved' ? 'success' : 'warning'}">${complaint.status || '<span class="text-muted">N/A</span>'}</span></p>
        </div>
  
        <h6 class="fw-bold mt-3">📅 Timestamps</h6>
        <div class="p-2 bg-light rounded">
          <p><strong>Created At:</strong> ${new Date(complaint.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> ${complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString() : '<span class="text-muted">N/A</span>'}</p>
        </div>
      </div>
    `;
  
    Swal.fire({
      title: '<strong>Complaint Details</strong>',
      html: complaintDetails,
      icon: 'info',
      width: '650px',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'swal-complaint-popup'
      }
    });
  }
  


}
