import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  apiStatus = 'Cargando estado de la API...';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getStatus().subscribe({
      next: (res) => {
        this.apiStatus = res.message;
      },
      error: (err) => {
        this.apiStatus = 'Error: No se pudo conectar a la API.';
        console.error(err);
      }
    });
  }
}
