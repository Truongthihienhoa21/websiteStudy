import { Injectable } from '@angular/core';
import { DataStoreService } from 'kinvey-angular-sdk';

@Injectable({ providedIn: 'root' })
export class DataStoreComponent {
  collection: any;
  constructor(datastoreService: DataStoreService) {
    this.collection = datastoreService.collection('category');
  }

  find(query) {
    this.collection.find(query).subscribe(
      (entities) => {
        // ...
      },
      (error) => {
        // ...
      },
      () => {
        // ...
      }
    );
  }
}
