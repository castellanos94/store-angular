import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Details } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/stores.interface';
import { DataService } from 'src/app/shared/services/data.services';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interfaces/product.interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: ''
  };

  isDelivery: boolean = true;

  cart: Product[] = [];
  stores: Store[] = [];

  constructor(private router: Router,
    private dataServiceSvc: DataService,
    private shoppingCartSvc: ShoppingCartService,
    private productSvc: ProductsService) {
    this.checkIfCartIsEmpty();
  }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
  }

  onPickupOrDelivery(isDelivery: boolean): void {
    this.isDelivery = isDelivery;
  }

  onSubmit({ value: formData }: NgForm): void {
    const data = {
      ...formData,
      data: this.getCurrentDate(),
      isDelivery: this.isDelivery
    }
    this.dataServiceSvc.saveOrder(data).pipe(
      tap(res => console.log('Order ->', res)),
      switchMap(({ id: orderId }) => {
        const details = this.prepareDetails();
        return this.dataServiceSvc.saveDetailsOrder({ details, orderId })
      }),
      tap(res => this.router.navigate(['/checkout/thank-you-page'])),
      tap(res => this.shoppingCartSvc.resetCart())
    ).subscribe();
  }

  private getStores(): void {
    this.dataServiceSvc.getStores().pipe(
      tap((stores: Store[]) => this.stores = stores)
    ).subscribe();
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, qty: quantity, stock } = product;
      const updateStock = (stock - quantity);
      // Esto es responsabilidad del back actualizar al obtener la peticion de order
      this.productSvc.updateStock(productId, updateStock).pipe(
        tap(res => console.log(res))
      ).subscribe();
      details.push({ productId, productName, quantity });
    });
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartSvc.cartAction$.pipe(
      tap((products: Product[]) => this.cart = products)
    ).subscribe();
  }

  private checkIfCartIsEmpty(): void {
    this.shoppingCartSvc.cartAction$.pipe(
      tap((products: Product[]) => {
        if (Array.isArray(products) && !products.length) {
          this.router.navigate(['/products']);
        }
      })
    ).subscribe();
  }
}
