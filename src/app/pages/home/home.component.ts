import { Component } from '@angular/core';
import { HeaderComponent } from "@shared/common/components/header/header.component";
import { CarouselComponent } from "../../shared/common/components/carousel/carousel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
