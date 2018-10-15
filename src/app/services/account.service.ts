import { Injectable } from '@angular/core';
import {Stock} from './stocks.model';

const defaultBalance = 10000;


@Injectable()
export class AccountService {
  private _balance: number = defaultBalance;
  private  _cost = 0;
  private  _value = 0;
  private  _stocks: Stock[] = [];

  get balance(): number {return this._balance; }
  get cost(): number {return this._cost; }
  get value(): number {return this._value; }
  get stocks(): Stock[] {return this._stocks; }

  purchase(stock: Stock): void {
    stock = Object.assign({}, stock); // clone object
    if (stock.price < this.balance) {
      this._balance = this.debit(stock.price, this.balance)
      stock.cost = stock.price;
      this._cost = this.credit(stock.price, this.cost);
      stock.change = 0;
      this._stocks.push(stock);
      this.calculateValue();
    }
  }

  sell(index: number): void {
    let stock = this.stocks[index];
    if (stock) {
      this._balance = this.credit(stock.price, this.balance)
      this._stocks.splice(index, 1);
      stock.cost = stock.price;
      this._cost = this.debit(stock.cost, this.cost);
      stock.change = 0;
      this._stocks.push(stock);
      this.calculateValue();
    }
  }


  calculateValue(){
    this._value = this._stocks.map(stock => stock.price)
      .reduce((a, b) => a + b , 0);
  }

  private debit(amount: number, balance: number) {
    return (balance * 100 - amount * 100) / 100;
  }

  private credit(amount: number, balance: number) {
    return (balance * 100 + amount * 100) / 100;
  }

  reset(){
    this._stocks =[];
    this._balance = defaultBalance;
    this._value = this._cost = 0;
  }
}

