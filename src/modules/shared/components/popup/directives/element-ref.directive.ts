import { Directive, ElementRef, EventEmitter, Output } from "@angular/core";





@Directive({
  selector: "[elemref]"
})
export class ElemRefDirective {

  @Output() onElemRef = new EventEmitter();


  constructor(
    private readonly el: ElementRef
  ) {}


  public ngAfterViewInit() {
    this.onElemRef.emit(this.el); 
  }

}