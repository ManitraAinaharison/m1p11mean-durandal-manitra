import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../../../core/services/stats.service';
import { Sales } from '../../../../../core/models/stats.model';



@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit{

  salesToday: Sales = {
    nbrAppointments: 0,
    sales: 0,
    gapFromPrev: 0
  };
  salesCurrMonth: Sales = {
    nbrAppointments: 0,
    sales: 0,
    gapFromPrev: 0
  };

  constructor(
    public statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.statsService
    .getCurrentSales()
    .subscribe((response) => {
        const res = response.payload;
        const yesterday = res.yesterday.sales == 0 ? 1 : res.yesterday.sales;
        let day = {
          nbrAppointments: res.today.nbrAppointments,
          sales: res.today.sales,
          gapFromPrev: ((res.today.sales - res.yesterday.sales)/yesterday) * 100
        };

        const lastMonth = res.lastMonth.sales == 0 ? 1 : res.lastMonth.sales;
        let month = {
          nbrAppointments: res.currentMonth.nbrAppointments,
          sales: res.currentMonth.sales,
          gapFromPrev: ((res.currentMonth.sales - res.lastMonth.sales)/lastMonth) * 100
        };

        this.salesToday = day;
        this.salesCurrMonth = month;
    });
  }

  showSign(n: number) {
    if(n >= 0) return '+';
    else return '';
  }


}
