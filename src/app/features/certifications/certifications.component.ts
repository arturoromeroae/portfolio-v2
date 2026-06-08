import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent {
  certs = inject(PortfolioDataService).certifications;
}
