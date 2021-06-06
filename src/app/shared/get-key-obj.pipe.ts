import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getKeyObj',
})
export class GetKeyObjPipe implements PipeTransform {
  transform(value: {}, ...args: unknown[]): string {
    return Object.keys(value)[0];
  }
}
