import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteProgressService {

  private progressSource = new Subject<boolean>();
  progress$ = this.progressSource.asObservable();

  show(): void {
    this.progressSource.next(true);
  }

  hide(): void {
    this.progressSource.next(false);
  }
}
