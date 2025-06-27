import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteEntry } from './remote-entry';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../services/Toast/toast.component';

describe('RemoteEntry', () => {
  let component: RemoteEntry;
  let fixture: ComponentFixture<RemoteEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), ToastComponent, RemoteEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoteEntry);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
