import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'jqwidgets-pdf';
  private employeeData: any[] = [];
  @ViewChild(jqxChartComponent, {static: false}) chart: jqxChartComponent;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.httpClient.get('http://dummy.restapiexample.com/api/v1/employees').subscribe((response: any) => {
      console.log(response);
      this.employeeData = response.data;
      const chartOptions: jqwidgets.ChartOptions = {
        title: '',
        description: '',
        enableAnimations: true,
        renderEngine: 'auto',
        source: this.employeeData,
        xAxis: {
          dataField: 'employee_age'
        },
        seriesGroups: [
          {
            type: 'column',
            series: [
              {dataField: 'employee_salary', displayText: 'Salary', labels: {visible: false}, useGradientColors: false, fillColor: 'blue'}
            ]
          }
        ]
      };
      this.chart.createComponent(chartOptions);
    });
  }

  generatePdf() {
    html2canvas(document.getElementById('myChart')).then(
      (canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('png'), 'PNG', 0, 0, 200, 200);
        pdf.output('dataurlnewwindow');
        // const elem = document.getElementById('myImage');
        // elem.setAttribute('src', canvas.toDataURL('image/png'));
      }
    );
  }

}
