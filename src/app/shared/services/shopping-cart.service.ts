import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from 'src/app/pages/products/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  products: Product[] = [];

  private cartSubject = new BehaviorSubject<Product[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private quantitySubject = new BehaviorSubject<number>(0);

  constructor() { }


  get totalAction$(): Observable<number> {
    return this.totalSubject.asObservable();
  }

  get quantityAction$(): Observable<number> {
    return this.quantitySubject.asObservable();
  }

  get cartAction$(): Observable<Product[]> {
    return this.cartSubject.asObservable();
  }
  
  private quantityProducts(): void {
    const quantityNumber= this.products.length;
    this.quantitySubject.next(quantityNumber);
  }

  private calcTotal(): void {
    const total = this.products.reduce((acc, prod) => acc += prod.price, 0)
    this.totalSubject.next(total);
  }

  private addTocart(product: Product): void {
    this.products.push(product);
    this.cartSubject.next(this.products);
  }

  updateCart(product: Product) {
    this.addTocart(product);
    this.quantityProducts();
    this.calcTotal();
  }
}
