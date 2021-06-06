// import { TestBed } from '@angular/core/testing';
// import {
//   DataStoreService,
//   DataStoreType,
//   KinveyModule,
//   Query,
// } from 'kinvey-angular-sdk';
// import { Observable, of } from 'rxjs';
// import { CollectionService } from './collection.service';

// describe('CollectionService', () => {
//   let service: CollectionService;
//   let data: DataStoreService;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [KinveyModule],
//       providers: [CollectionService, DataStoreService],
//     });
//     data = new DataStoreService({
//       appKey: 'kid_r1x-mZeCw',
//       appSecret: 'c43aec5e8ffa4221a1ae126a87d30465',
//     });
//     service = new CollectionService(data, 'courses', DataStoreType.Network);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should return find data', () => {
//     const fakeData = [
//       {
//         _id: 'fakeid1',
//         img: 'fakeimgurl1',
//         name: 'fakename1',
//         group_name: 'fakegroupname1',
//         'sub-group': 'fakesubgroup1',
//         main_group: 'fakemaingroup1',
//       },
//       {
//         _id: 'fakeid2',
//         img: 'fakeimgurl2',
//         name: 'fakename2',
//         group_name: 'fakegroupname2',
//         'sub-group': 'fakesubgroup2',
//         main_group: 'fakemaingroup2',
//       },
//     ];

//     const expectedData = [
//       {
//         _id: 'fakeid1',

//         name: 'fakename1',
//       },
//       {
//         _id: 'fakeid2',

//         name: 'fakename2',
//       },
//     ];
//     spyOn(service, 'find').and.callFake(
//       (query: Query): Observable<any[]> => {
//         let result: Array<any> = [];
//         fakeData.forEach((fakeObj) => {
//           let tempObj = {};
//           query.fields.forEach((queryName) => {
//             tempObj[queryName] = fakeObj[queryName];
//           });
//           result.push(tempObj);
//         });

//         return of(result);
//       }
//     );
//     const fakeQuery = new Query();
//     fakeQuery.fields = ['name', '_id'];
//     service.find(fakeQuery).subscribe((respone) => {
//       expect(respone).toEqual(expectedData);
//     });
//   });

//   it('should return findById data', () => {
//     const fakeData = [
//       {
//         _id: 'fakeid1',
//         img: 'fakeimgurl1',
//         name: 'fakename1',
//         group_name: 'fakegroupname1',
//         'sub-group': 'fakesubgroup1',
//         main_group: 'fakemaingroup1',
//       },
//       {
//         _id: 'fakeid2',
//         img: 'fakeimgurl2',
//         name: 'fakename2',
//         group_name: 'fakegroupname2',
//         'sub-group': 'fakesubgroup2',
//         main_group: 'fakemaingroup2',
//       },
//     ];

//     const expectedData = {
//       _id: 'fakeid2',
//       img: 'fakeimgurl2',
//       name: 'fakename2',
//       group_name: 'fakegroupname2',
//       'sub-group': 'fakesubgroup2',
//       main_group: 'fakemaingroup2',
//     };
//     spyOn(service, 'findById').and.callFake(
//       (id: string): Observable<any> => {
//         let result = {};
//         fakeData.forEach((fakeObj) => {
//           if (id == fakeObj._id) {
//             result = fakeObj;
//           }
//         });

//         return of(result);
//       }
//     );
//     const queryId = 'fakeid2';
//     service.findById(queryId).subscribe((respone) => {
//       expect(respone).toEqual(expectedData);
//     });
//   });

//   it('should return group data', () => {
//     const fakeData = [
//       { name: '111', age: 'aaa', class: '!!!' },
//       { name: '111', age: 'fff', class: '!!!' },
//       { name: '111', age: 'ggg', class: '!!!' },
//       { name: '222', age: 'hhh', class: '@@@' },
//       { name: '333', age: 'aaa', class: '###' },
//       { name: '444', age: 'ddd', class: '$$$' },
//       { name: '555', age: 'eee', class: '%%%' },
//     ];

//     const expectedData = ['111', '333'];
//     spyOn(service, 'group').and.callFake(
//       (columnName: string, query: Query): Observable<string[]> => {
//         let result: Array<string> = [];
//         fakeData.forEach((fakeObj) => {
//           for (let key in query.filter) {
//             if (fakeObj[key] == query.filter[key]) {
//               result.push(fakeObj[columnName]);
//             }
//           }
//         });

//         return of(result);
//       }
//     );
//     const fakeQuery = new Query();
//     const fakeColumn = 'name';
//     fakeQuery.equalTo('age', 'aaa');
//     service.group(fakeColumn, fakeQuery).subscribe((respone) => {
//       expect(respone).toEqual(expectedData);
//     });
//   });
// });
