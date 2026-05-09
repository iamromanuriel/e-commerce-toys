import { Component } from '@angular/core';
import { TopBarComponentComponent } from '../top-bar-component/top-bar-component.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [TopBarComponentComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css'
})
export class HomeScreenComponent {

}
