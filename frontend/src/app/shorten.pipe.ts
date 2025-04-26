import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenAddress'
})
export class ShortenAddressPipe implements PipeTransform {
  transform(value: string, length: number = 6): string {
    if (!value) return '';
    if (value.length <= length * 2) return value;
    return `${value.substring(0, length)}...${value.substring(value.length - length)}`;
  }
}