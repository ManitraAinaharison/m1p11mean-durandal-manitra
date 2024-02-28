import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TreeParent } from '../../../core/models/tree.model';

@Component({
  selector: 'tree-checkbox',
  templateUrl: './tree-checkbox.component.html',
  styleUrl: './tree-checkbox.component.css'
})
export class TreeCheckboxComponent implements OnChanges {

  @Input() data: TreeParent[] = [];
  @Input() checkedData: string[] = [];
  @Output() checkedValues: EventEmitter<any> = new EventEmitter<any>();

  public checkedKeys: string[] = this.checkedData;

  ngOnChanges(changes: SimpleChanges): void {
    console.log( changes);
    if ('checkedData' in changes) {
      this.checkedData = changes['checkedData'].currentValue;
      this.checkedKeys = this.checkedData;
    }
  }

  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  private formatCheckValues() {
    let Treechildren: string[] = this.checkedKeys.filter(checkedKey => checkedKey.includes('_'));
    return Treechildren.map((checkedKey: string) => {
      const splitedCheckedKey: string[] = checkedKey.split('_') as string[];
      const parentIndex = +splitedCheckedKey[0];
      const childIndex = +splitedCheckedKey[1];
      return this.data[parentIndex].items![childIndex].value;
    });
  }

  onValueChange() {
    const checkValues = this.formatCheckValues();
    this.checkedValues.emit(checkValues);
  }
}
