import { Component } from "@angular/core";
import { ShoppingCartService } from "../../services/shopping-cart.service";

@Component({
    selector: 'app-cart',
    templateUrl:'./cart.component.html'
})

export class CartComponent {
    total$ = this.shoppingCartSvc.totalAction$;
    cart$ = this.shoppingCartSvc.cartAction$;
    quantity$ = this.shoppingCartSvc.quantityAction$;


    constructor(private shoppingCartSvc: ShoppingCartService) { }
}