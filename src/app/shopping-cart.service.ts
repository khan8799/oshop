import { Observable } from 'rxjs/internal/Observable';
import { ShoppingCart } from './models/shopping-cart';
import { take, map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  create() {
    return this.db.list('/shopping-carts/').push({
      dateCreated: new Date().getTime()
    });
  }

  async addToCart(product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product) {
    this.updateItem(product, -1);
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();

    return this.db.object('/shopping-carts/' + cartId).snapshotChanges().pipe(map(x => {
      return new ShoppingCart(x.payload.val());
    }));
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private getItem(cartId: string, productId: string): AngularFireObject<{product, quantity}> {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');

    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let items$ = this.getItem(cartId, product.key);

    items$.snapshotChanges().pipe(take(1)).subscribe(item => {
      let quant = 0;
      if (item.payload.hasChild('quantity'))
        quant = item.payload.val().quantity;

      quant = (quant || 0) + change;
      if (quant === 0)
        items$.remove();
      else {
        let object = { ...product, quantity: quant };
        items$.update(object);
      }
    });
  }
}
