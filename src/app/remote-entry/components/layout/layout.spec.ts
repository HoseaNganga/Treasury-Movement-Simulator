import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NavComponent } from '../global/nav/nav.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    mockRouter = {
      events: of(new NavigationEnd(1, '/test', '/test')),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn(),
        },
      },
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        NgxSpinnerModule,
        BrowserAnimationsModule,
        NavComponent,
        Layout,
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize, show spinner, and scroll to top on NavigationEnd', () => {
    jest.useFakeTimers();
    const scrollToSpy = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    component.ngOnInit();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    jest.advanceTimersByTime(3000);
    expect(mockSpinnerService.hide).toHaveBeenCalled();

    scrollToSpy.mockRestore();
    jest.useRealTimers();
  });
});
