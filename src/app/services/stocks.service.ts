import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Stock} from './stocks.model';
import {ConfigService} from './config.service';

@Injectable()
export class StocksService {

  constructor (private http: HttpClient){}

  getStocks() {
    return this.http.get<Array<Stock>> (ConfigService.get('api'));
  }

}
