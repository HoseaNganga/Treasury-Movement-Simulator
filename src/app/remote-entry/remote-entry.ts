import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../services/Toast/toast.component';

@Component({
  selector: 'app-remote-entry',
  imports: [RouterModule, ToastComponent],
  templateUrl: './remote-entry.html',
  styleUrl: './remote-entry.scss',
})
export class RemoteEntry {}
