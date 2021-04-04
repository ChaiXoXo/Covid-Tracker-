import { Component, OnInit } from '@angular/core';
import { IGlobalDataSummary } from '../../global-data-summ';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: IGlobalDataSummary[];
  dataTable = [];
  chart = {
    PieChart : "PieChart",
    ColumnChart : "ColumnChart",
    height : 500,
    options : {
      animation : {
        duration : 1000,
        easing : "out"
      },
      is3D: true
    }
  }

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {
    // this.dataService.getGlobalData().subscribe(data => {
    //   console.log(data);
    // })

    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        //console.log(result);
        this.globalData = result;
        result.forEach(cs => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalConfirmed += cs.confirmed;
            this.totalActive += cs.active;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          } else { console.log("Confirmed is NaN !"); }
        })

        this.initChart('confirmed');
      }
    })
  }

  initChart(caseType) {

    this.dataTable = [];
    //this.dataTable.push(["Country", "Cases"])
    this.globalData.forEach(cs => {
      console.log("CS ==> ", cs);
      let value: number;

      if (caseType == "confirmed") 
        if (cs.confirmed > 10000) 
          value = cs.confirmed
       
      if (caseType == "active")
        if (cs.active > 10000) 
          value = cs.active
       
      if (caseType == "deaths") 
        if (cs.deaths > 5000) 
          value = cs.deaths
       
      if (caseType == "recovered") 
        if (cs.recovered > 10000) 
          value = cs.recovered
        
      this.dataTable.push([
        cs.country, value
      ])
    })
    console.log("dataTable ==> ",this.dataTable);
    
  }

  updateValues(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

}
