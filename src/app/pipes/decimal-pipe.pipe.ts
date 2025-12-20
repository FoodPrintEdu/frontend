import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalPipe',
})
export class DecimalPipePipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 2): number {
    return Number(value.toFixed(decimalPlaces));
  }
}
