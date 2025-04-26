import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationServicesService {
  private governoratesUrl = 'https://raw.githubusercontent.com/Tech-Labs/egypt-governorates-and-cities-db/master/governorates.json';
  private citiesUrl = 'https://raw.githubusercontent.com/Tech-Labs/egypt-governorates-and-cities-db/master/cities.json';

  constructor(private http: HttpClient) {}

  getGovernorates(): Observable<any[]> {
    return this.http.get<any[]>(this.governoratesUrl);
  }

  // getCities(governorateId: number): Observable<any[]> {
  //   return this.http.get<any[]>(this.citiesUrl).pipe(
  //     map(cities => cities.filter(city => city.governorate_id === governorateId))
  //   );
  // }


  getCities(governorateId: number): Observable<any[]> {
    return this.http.get<any[]>(this.citiesUrl).pipe(
      map(cities => {
        let arr:any[] = cities[2].data;
        return arr.filter(city => city.governorate_id === governorateId);
      })
    );
  }
  

}
