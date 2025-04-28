export interface MainInventory {
    product: string;
}

export interface BranchManager {
    firstName: string;
    lastName: string;
    branch: string;
}

export interface DistReq {
    _id: string;
    mainInventory: MainInventory;
    branchManager: BranchManager;
    requestedQuantity: number;
    productDetails: {name:string,images:string[]};
    branchDetails:{branchName:string};
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    createdAt: string;
    updatedAt: string;
}
