import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  template: `<router-outlet />`,
  styles: [`
    :host { display: block; }
  `]
})
export class App {}
