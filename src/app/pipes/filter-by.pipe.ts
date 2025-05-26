import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
  standalone: true // Importante para componentes standalone
})
export class FilterByPipe implements PipeTransform {

  transform(items: any[], search: string = '', fields: string = ''): any[] {
    if (!items || !search) return items;

    const keys = fields.split(' ');
    return items.filter(item =>
      keys.some(key => item[key]?.toLowerCase().includes(search.toLowerCase()))
    );
  }
}