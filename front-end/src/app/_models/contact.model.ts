export interface Complaint {
    _id: string;
    user?: {_id:string,firstName:string,lastName:string,email:string};
    email?: string;
    subject: string;
    description: string;
    status?: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
    createdAt: Date;
    updatedAt?: Date;
  }
  
