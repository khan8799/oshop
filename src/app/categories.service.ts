import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/categories').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        return { key, data };
      }))
    );
  }
}
