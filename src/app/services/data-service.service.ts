import { HttpBackend, HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { IDateWiseData } from 'src/date-wise-data';
import { IGlobalDataSummary } from '../global-data-summ';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  public headers: HttpHeaders;
  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-14-2021.csv`;
  //private globalDataUrl = "https://covid19.mathdro.id/api";
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;

  constructor(private http: HttpClient) {
    // this.headers = new HttpHeaders({
    //   'Content-Type':'application/json'
    // })
  }

  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl,{ responseType: 'text' }).pipe(
      map(result => {
        //console.log("result => " + result);
        let rows  = result.split("\n");
        //console.log("rows => " + rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0,4);
        //console.log("dates => " + dates);
        rows.splice(0,1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0,40);
          //console.log(country, cols);
          mainData[country] = [];
          cols.forEach((value,index) => {
            let dw : IDateWiseData = {
              cases : +value,
              country : country,
              date : new Date(Date.parse(dates[index]))
            }
            mainData[country].push(dw);
          });
          
        });
        return mainData;
      })
    )

  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data : IGlobalDataSummary[] = []; 
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0,1);
        //console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          //console.log(cols);
          let cs = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10]
          }
          let temp : IGlobalDataSummary = raw[cs.country]
          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            raw[cs.country] = temp;
          }
          else{
            raw[cs.country] = cs;
          }
        })
        //console.log(raw);
        

        return <IGlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}

