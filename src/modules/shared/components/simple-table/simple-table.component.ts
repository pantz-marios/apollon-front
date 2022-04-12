import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { SimpleTableColumn, SimpleTableColumnType } from './simple-table.model';





@Component({
  selector: 'simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTableComponent implements OnInit {
  @Input() items: Observable<any>;
  @Input() columns: SimpleTableColumn[];

  @Input() hideHeader: boolean;



  constructor() {}



  public ngOnInit() {

  }

  public ngOnChanges() {
    if(this.columns == null) {
      return;
    }

    // set default values
    this.columns.forEach((col) => {
      if(col.type == null) {
        col.type = SimpleTableColumnType.Default;
      }
    });
  }

  public ngOnDestroy() {

  }


}