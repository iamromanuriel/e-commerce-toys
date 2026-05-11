import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  websiteUrl: string = 'https://practicas-b2fd0.web.app/';

  navLinks = [
    { label: 'Inicio', href: '#' },
    { label: 'Proyectos', href: '#' },
    { label: 'Sobre mí', href: '#' },
    { label: 'Contacto', href: '#' }
  ];

}
