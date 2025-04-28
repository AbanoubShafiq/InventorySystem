export interface userProfile {
    _id:string|null;
    firstName: string;
    lastName: string;
    email: string;
    address: {
        street: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
      } | null;
    contactNo: string;
    image: string;
}
  