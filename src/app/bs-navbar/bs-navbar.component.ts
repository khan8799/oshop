import { ShoppingCartService } from './../shopping-cart.service';
import { AppUser } from './../models/app-user';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser;
  shoppingCartItemCount: number;
  cart$: Promise<Observable<ShoppingCart>>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private shoppingCartServic: ShoppingCartService) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    this.shoppingCartServic.getCart().then(x => {
      x.subscribe(count => {
        this.shoppingCartItemCount = 0;
        if (count.items)
          this.shoppingCartItemCount = count.totalItemsCount;
      });
    });
  }
}
