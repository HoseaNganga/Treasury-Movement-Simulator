import { Component } from '@angular/core';
import { NavComponent } from '../global/nav/nav.component';

@Component({
  selector: 'app-layout',
  imports: [NavComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
