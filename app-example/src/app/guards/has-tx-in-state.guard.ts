import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HasTxInStateGuard implements CanActivate {
    constructor(private readonly router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const routerState = this.router.getCurrentNavigation()?.extras?.state;
        return !routerState ? this.router.createUrlTree(['/']) : true;
    }

}
