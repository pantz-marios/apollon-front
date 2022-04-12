import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';





@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnInit {
  public searchValue: string;

  @Input() public searchQuery: any;
  @Output() onSearch = new EventEmitter();



  constructor() {}



  public ngOnInit() {

  }

  public ngOnChanges(changes: SimpleChanges) {
    if(changes.searchQuery) {
      this.searchValue = this.searchQuery;
    }
  }

  public ngOnDestroy() {

  }



  public onSearchButtonClicked() {
    this.onSearch.emit(this.searchValue);
  }

  public onSearchInputKeyUp(e) {
    if(e.keyCode === 13) {
      this.onSearch.emit(this.searchValue);
    }
  }

}