import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input('totalConfirmed') 
  totalConfirmed;
  @Input('totalActive') 
  totalActive;
  @Input('totalDeaths') 
  totalDeaths;
  @Input('totalRecovered') 
  totalRecovered;

  constructor() { }

  ngOnInit() {
  }

}
