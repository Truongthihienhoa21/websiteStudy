import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValueObj',
})
export class GetValueObjPipe implements PipeTransform {
  transform(value: {}, ...args: unknown[]): any[] {
    return value[Object.keys(value)[0]];
  }
}
