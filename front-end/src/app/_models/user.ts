export class User {
    constructor(
        _id:string,
        role:string,
        email:string, 
        password:string, 
        salt:string,
        firstName:string,
        lastName:string,
        address:Address,
        contactNo:string,
        image: string,
        isActive:string
    ){

    }
}

export class Address  {
    constructor(
        street:string,
        city:string,
        state:string,
        zipCode:string
    ){}
}
