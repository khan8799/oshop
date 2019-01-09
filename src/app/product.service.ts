import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Products } from './models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products/').push(product);
  }

  getAll() {
    return this.db.list('/products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        return { key, ...data };
      }))
    );
  }

  get(productId: string) {
    return this.db.object<Products>('/products/' + productId).valueChanges();
  }

  update(productId: string, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId: string) {
    this.db.object('/products/' + productId).remove();
  }
}
