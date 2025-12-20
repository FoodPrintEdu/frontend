import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {UserResponse} from '../../../types/userTypes';
import {WeightPrediction} from '../../../types/weightPredictionTypes';
import {ApiService} from '../../../service/api.service';
import {ApiResponse} from '../../../types/ApiResponse';

@Component({
  selector: 'app-weight-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.scss']
})
export class WeightChartComponent implements OnInit {

  @Input() user: UserResponse;
  numOfWeeks: number = 16;
  weightPrediction: WeightPrediction;
  protected lineChartData: ChartConfiguration<'line'>['data'];
  protected lineChartOptions: ChartOptions<'line'>;

  constructor(private apiService: ApiService) {
  }

  async ngOnInit() {

    try {
      this.weightPrediction = (await this.apiService
        .get<ApiResponse<any>>(
          `/diet/api/v1/client-diets/weight-prediction/${this.user.id}/${this.numOfWeeks}`,
        )).data;
    } catch (e) {
      console.error('Get weight prediction failed', e);
    }

    console.log(this.weightPrediction);
    const labels: string[] = this.getChartLabels(this.weightPrediction);
    let data = [this.weightPrediction.startWeight, ...this.weightPrediction.weightByWeeks]
    console.log(data);
    // 1. Define the chart data
    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Predicted Weight',
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: '#9ca3af',
          pointBackgroundColor: '#9ca3af'
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          title: {display: true, text: 'Weight (kg)'},
          suggestedMin: 80
        }
      }
    };
  }
  public lineChartLegend = true;

  private getChartLabels(weightPrediction: WeightPrediction) {
    const predictions = ['Start'];
    for (let i = 0; i < weightPrediction.numOfWeeks; i++) {
      predictions.push(`Week ${i + 1}`);
    }
    return predictions;
  }
}
