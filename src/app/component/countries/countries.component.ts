import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGlobalDataSummary } from 'src/app/global-data-summ';
import { DataServiceService } from 'src/app/services/data-service.service';
import { IDateWiseData } from 'src/date-wise-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  public data: IGlobalDataSummary[];
  countries: String[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  public selectedCountryData: IDateWiseData[];
  public dateWiseData;
  chart = {
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: "out"
      },
      is3D: true
    }
  }
  dataTable: any[];

  constructor(private http: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.http.getDateWiseData().pipe(map(result => {
        this.dateWiseData = result;
      })
      ),
      this.http.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country);
        })
      })
      ),
    ).subscribe(
      {
        complete : () => {
          this.updateValues('India');
        } 
      }
    )

  }


  updateChart(caseType) {
    this.dataTable = [];
    //this.dataTable.push(['Cases', 'Date']);
    this.selectedCountryData.forEach(data => {
      let value: any;

      if (caseType == "cases")
        value = data.cases

      if (caseType == "dates")
        value = data.date

      this.dataTable.push([
        data.date, data.cases
      ])
    });

    console.log(this.dataTable);
  }


  updateValues(country) {
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active,
          this.totalConfirmed = cs.confirmed,
          this.totalDeaths = cs.deaths,
          this.totalRecovered = cs.recovered
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    //console.log(this.selectedCountryData);
    this.updateChart('cases');

  }

}
