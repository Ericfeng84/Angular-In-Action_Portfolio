import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from '../../../node_modules/rxjs';
import {ConfigService} from './config.service';
import {Stock} from './stocks.model';
import 'rxjs/add/operator/do';

@Injectable()
export class StocksInterceptor implements HttpInterceptor{

  constructor(private  accountService: AccountService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone();
    request.headers.append('Accept', 'application/json');
    return next.handle(request).do(event => {
      if (event instanceof HttpResponse && event.url === ConfigService.get('api')) {
        const stocks = event.body as Array<Stock>;
        let symbols = this.accountService.stocks.map(stock => stock.symbol);
        stocks.forEach(stock => {
          this.accountService.stocks.map(item => {
            if (stock.symbol === item.symbol) {
              item.price = stock.price;
              item.change = ((stock.price * 100) - (item.cost * 100)) / 100;
            }
          });
        });
        this.accountService.calculateValue();
        return stocks;
      }
    });
  }
}
