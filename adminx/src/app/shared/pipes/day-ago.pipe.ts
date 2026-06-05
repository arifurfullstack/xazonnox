import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../../services/core/utils.service';


@Pipe({
  name: 'dayAgo',
  standalone: true,
})
export class DayAgoPipe implements PipeTransform {

  constructor(protected utilsService: UtilsService) {
  }

  public transform(value: any): string {
    return this.utilsService.getDateToDayAgo(value);
  }


}
