import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDto } from '../interfaces/ProductDto';
import { CallServerService } from './call-server.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private callServer: CallServerService) {}

  getProducts(params: any): Observable<ProductDto[]> {
    return this.callServer.get<ProductDto[]>('/api/Products', params);
  }

  getProduct(id: number): Observable<ProductDto> {
    return this.callServer.get<ProductDto>(`/api/Products/${id}`);
  }
}
