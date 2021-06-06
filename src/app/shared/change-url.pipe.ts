import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeUrl',
})
export class ChangeUrlPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    value = value.replace(/[\s?]/g, '-');
    return value;
  }
}
