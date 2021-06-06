import { TestBed } from '@angular/core/testing';
import { DataStoreService, KinveyModule } from 'kinvey-angular-sdk';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Category } from '../model/model';
import { CategoryName } from '../store';
import { CategoryService } from './category.service';
import { category } from './chart.service';
import { CollectionService } from './collection.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockDataStore: any;
  let fakeCategoryData: any[];
  beforeEach(() => {
    fakeCategoryData = [
      {
        desc: '',
        group: '',
        idparent: '',
        img: '',
        title: 'Tin hoc',
        _id: '1',
      },
      {
        desc: '',
        group: '',
        idparent: '',
        img: '',
        title: 'Lap trinh',
        _id: '2',
      },
      {
        desc: 'tinhoc1',
        group: 'Tin hoc',
        idparent: '1',
        img: '',
        title: 'excel',
        _id: '3',
      },
      {
        desc: '',
        group: '',
        idparent: '2',
        img: '',
        title: 'Web-front',
        _id: '4',
      },
      {
        desc: '',
        group: '',
        idparent: '4',
        img: '',
        title: 'js',
        _id: '5',
      },
      {
        desc: '',
        group: '',
        idparent: '5',
        img: '',
        title: 'js can ban',
        _id: '6',
      },
    ];
    mockDataStore = {
      collection: () => null,
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: DataStoreService, useValue: mockDataStore },
        CategoryService,
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  describe('test state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get data', () => {
      let data: any;
      service
        .selectData('categoryName')
        .pipe(first())
        .subscribe((val) => {
          data = val;
        });
      expect(data).toBe(null);
    });

    it('should update state', () => {
      let fakeData: CategoryName = {
        'Lập trình': null,
        anothers: null,
      };
      let data: any;
      service.setState({ categoryName: fakeData });

      service
        .selectData('categoryName')
        .pipe(first())
        .subscribe((val) => {
          data = val;
        });
      expect(data).toBe(fakeData);
    });

    it('should group data', () => {
      let data: any;
      spyOn(service, 'find').and.returnValue(of([]) as any);

      service.getGroup('').subscribe((val) => {
        data = val;
      });

      expect(data).toEqual([]);
    });
  });
});
