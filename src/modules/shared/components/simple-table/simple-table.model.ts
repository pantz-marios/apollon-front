import { ElementRef } from '@angular/core';





export class SimpleTableColumn {
  property: string;
  header: string;
  type?: SimpleTableColumnType;
  customCellTemplate?: ElementRef;
  className?: string;
}

export enum SimpleTableColumnType {
  Default = 0,
  Custom = 1,
}

export interface SimpleTableRowSettings {
  rowSelected?: boolean;
}