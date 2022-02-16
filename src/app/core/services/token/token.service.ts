import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LaceTokenInfo } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private url = '/api/cryptocurrencies/';

  constructor(private http: HttpClient) { }

  getLaceTokenInfo(symbol: string = 'lace'): Observable<LaceTokenInfo> {
    return this.http.get<LaceTokenInfo>(`${this.url}${symbol}/quotes`);
  }
}
