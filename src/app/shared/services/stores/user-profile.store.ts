// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { filter, switchMap, takeUntil } from 'rxjs/operators';

// import { BaseSubscriberComponent } from '@core/base-subscriber-component';
// import { User } from '@core/models/user';
// import { LOCAL_STORAGE_KEYS } from '@shared/enums';
// import { SnackBarService } from '@shared/services/helpers/snack-bar';
// import { PaginationDataResponse, UserTokenCollection } from '@shared/interfaces';
// import { CollectionsApiService } from '@shared/services/api/collections-api.service';
// import { UserApiService } from '../api';
// import { AuthStore } from './auth.store';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserProfileStore extends BaseSubscriberComponent {
//   private _profile: BehaviorSubject<User> = new BehaviorSubject(null);
//   public userCollections: UserTokenCollection[];

//   constructor(
//     private http: HttpClient,
//     private userApiService: UserApiService,
//     private collectionsApiService: CollectionsApiService,
//     private authStore: AuthStore,
//     private router: Router,
//     private snackBarService: SnackBarService
//   ) {
//     super();
//     if (this.authStore.ethEnabled) {
//       this.subscribeOnUserId();
//       this.subscribeOnMetamask();
//       this.subscribeOnNavigation();
//     }
//   }

//   public get profile(): Observable<User> {
//     return this._profile.asObservable();
//   }

//   public getCollectionsList(): void {
//     this.collectionsApiService.getCollectionsList('offset=0&limit=10')
//       .pipe(takeUntil(this.notifier))
//       .subscribe((collectionsRes: PaginationDataResponse<UserTokenCollection>) => {
//         this.userCollections = collectionsRes.data;
//       });
//   }

//   public setProfile(): void {
//     const id = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
//     if (id) {
//       this.userApiService.apiGetProfile(id)
//         .pipe(takeUntil(this.notifier))
//         .subscribe((p: User) => this._profile.next(p));
//     }
//   }

//   public editProfile(profile: FormData, id: string): void {
//     this.userApiService.apiPutProfile(id, profile)
//       .pipe(takeUntil(this.notifier))
//       .subscribe((p: User) => this._profile.next(p));
//   }

//   public updateProfileByValue(user: User): void {
//     if (!user || !user.id || this._profile?.value?.id !== user.id) {
//       return;
//     }

//     this._profile.next(user);
//   }

//   private subscribeOnNavigation(): void {
//     this.router.events
//       .pipe(
//         filter(event => event instanceof NavigationEnd),
//         takeUntil(this.notifier)
//       )
//       .subscribe(() => {
//         if (!this.authStore.authorised && !this.authStore.isConnected) {
//           this.snackBarService.showSnackBar('The wallet disconnected! Please, connect the wallet.', 'snack-bar-error', false);
//         }
//       });
//   }

//   private subscribeOnMetamask(): void {
//     this.authStore.accountChanged
//       .pipe(
//         switchMap((accounts: string[]) => {
//           if ((accounts?.[0] !== this.authStore.account?.toLowerCase() && this.authStore.authorised) && !this.authStore.arkaneWallet) {
//             return this.authStore.logout();
//           }
//           return of(null);
//         }),
//         takeUntil(this.notifier)
//       )
//       .subscribe();
//   }

//   private subscribeOnUserId(): void {
//     this.authStore.userId
//       .pipe(takeUntil(this.notifier))
//       .subscribe(() => this.setProfile());
//   }
// }
