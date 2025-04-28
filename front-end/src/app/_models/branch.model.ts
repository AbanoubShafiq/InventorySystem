export interface Branch {
    _id: string;
    branchName: string;
    location?: string;
    contactNumber?: string;
    type: "offline" | "online";
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    showSubSubMenu:boolean
  }
  