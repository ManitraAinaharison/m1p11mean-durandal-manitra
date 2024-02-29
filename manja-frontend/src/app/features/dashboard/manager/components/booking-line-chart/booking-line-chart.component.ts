import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { StatsService } from '../../../../../core/services/stats.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-booking-line-chart',
  templateUrl: './booking-line-chart.component.html',
  styleUrl: './booking-line-chart.component.css'
})
export class BookingLineChartComponent implements OnInit{

  listMonths: string[] = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout','Septembre', 'Octobre', 'Novembre', 'Decembre'];
  yData = [0, 0, 0, 0, 0, 0];
  xData = ["", "", "", "", "", ""];

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(
    public statsService: StatsService
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Chiffres d'affaire/ Nbr RDV",
          data: this.yData
        }
      ],
      chart: {
        height: 350,
        type: "line",
        fontFamily: 'DM Sans',
        toolbar: {
          show: false
        }
      },
      title: {

      },
      xaxis: {
        categories: this.xData
      }
    };
  }
  ngOnInit(): void {
    this.statsService
    .getBookingFromLastSix()
    .subscribe((response) => {
      const res = response.payload;
      console.log(res);
      this.yData = res.map((x: any) => x.sales).reverse();
      this.xData = res.map((x: any) => this.listMonths[x.month] + ' ' + x.year).reverse();
      this.refreshChart();
    });
  }

  refreshChart() {
    this.chartOptions = {
      series: [
        {
          name: "Chiffres d'affaire/ Nbr RDV",
          data: this.yData
        }
      ],
      chart: {
        height: 350,
        type: "line",
        fontFamily: 'DM Sans',
        toolbar: {
          show: false
        }
      },
      title: {

      },
      xaxis: {
        categories: this.xData
      }
    };
  }
}
