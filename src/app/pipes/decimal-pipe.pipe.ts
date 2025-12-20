import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalPipe',
  standalone: true
})
export class DecimalPipePipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 2): number {
    return Number(value.toFixed(decimalPlaces));
  }
}
