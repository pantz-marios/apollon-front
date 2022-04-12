import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";





@Directive({
  selector: "[img-loader]"
})
export class ImgLoaderDirective {
  @Output() onLoad = new EventEmitter();



  constructor(
    private readonly el: ElementRef<HTMLImageElement>
  ) {
    if(this.el.nativeElement.complete) {
      this.onLoad.emit(this.el);
    }
  }



  @HostListener('load')
  private onImgLoad() {
    this.onLoad.emit(this.el);
  }

}