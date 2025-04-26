import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  chartData = [
    { "name": "Products", "value": 50 },
    { "name": "Orders", "value": 120 },
    { "name": "Users", "value": 80 }
  ];
  ngxChartData = [
    { name: 'January', value: 5000 },
    { name: 'February', value: 3000 },
    { name: 'March', value: 7000 }
  ];
  multi: any[] = [];
  view: [number, number] = [700, 400];

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Months';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';

  // Chart data
  constructor() {
    this.multi = [
      {
        "name": "Product A",
        "series": [
          { "name": "Jan", "value": 50 },
          { "name": "Feb", "value": 80 },
          { "name": "Mar", "value": 60 },
          { "name": "Apr", "value": 100 }
        ]
      },
      {
        "name": "Product B",
        "series": [
          { "name": "Jan", "value": 40 },
          { "name": "Feb", "value": 60 },
          { "name": "Mar", "value": 90 },
          { "name": "Apr", "value": 120 }
        ]
      }
    ];
  } 
}
