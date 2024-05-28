import { Component, inject, OnInit } from '@angular/core';
import {
  DataViewColumnDef,
  DataViewComponent,
  DataViewRowSelectionEvent,
  EmrPanelModule,
  EmrSegmentedModule
} from '@elementar/components';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    EmrPanelModule,
    DataViewComponent,
    MatPaginator,
    MatButtonToggle,
    MatButtonToggleGroup,
    FormsModule,
    MatTab,
    MatTabGroup,
    EmrSegmentedModule
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  private _httpClient = inject(HttpClient);

  status = 'published';
  columnDefs: DataViewColumnDef[] = [
    {
      name: 'Position',
      dataField: 'position',
      visible: true
    },
    {
      name: 'Name',
      dataField: 'name',
      visible: true
    },
    {
      name: 'Weight',
      dataField: 'weight',
      visible: true
    },
    {
      name: 'Symbol',
      dataField: 'symbol',
      visible: true
    }
  ];
  data = [...DATA];

  selectedRows: PeriodicElement[] = [];

  posts$: Observable<any> = this._httpClient.get('http://localhost:8000/api/posts', {
    headers: {
      'Accept': 'application/json'
    }
  }).pipe(
    tap(res => {
      // console.log(res);
    })
  );

  ngOnInit() {
    this.posts$.subscribe(res => {

    });
  }

  rowSelectionChanged(event: DataViewRowSelectionEvent<PeriodicElement>): void {
    console.log(event);
  }

  selectionChanged(rows: PeriodicElement[]): void {
    this.selectedRows = rows;
  }

  allRowsSelectionChanged(isAllSelected: boolean): void {
    console.log(isAllSelected);
  }
}