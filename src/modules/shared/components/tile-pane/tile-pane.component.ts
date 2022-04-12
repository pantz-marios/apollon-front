import { Component, OnInit, Input } from '@angular/core';





@Component({
  selector: 'tile-pane',
  templateUrl: './tile-pane.component.html',
  styleUrls: ['./tile-pane.component.css'],
})
export class TilePaneComponent implements OnInit {
  @Input() items: any[];
  @Input() public itemTemplate: any;

  // @Input() itemWidth: string;
  // @Input() itemHeight: string;
  // @Input() horizontalSpacing: string;
  // @Input() verticalSpacing: string;



  constructor() {}



  public ngOnInit() {

    // console.log('\n\n');
    // console.log(this.itemWidth);
    // console.log(this.itemHeight);
    // console.log(this.horizontalSpacing);
    // console.log(this.verticalSpacing);
    // console.log('\n\n');
    
  }

  public ngAfterViewInit() {

  }

  public ngOnDestroy() {

  }

}