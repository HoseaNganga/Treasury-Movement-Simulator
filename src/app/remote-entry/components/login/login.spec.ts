import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EnvironmentService } from '../../../../environments/environment.service';
import { Login } from './login';

// Mock the global google object
const mockGoogle = {
  accounts: {
    id: {
      initialize: jest.fn(),
      renderButton: jest.fn(),
    },
  },
};

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockRouter: jest.Mocked<Router>;
  let mockEnvironmentService: jest.Mocked<EnvironmentService>;

  const mockGoogleClientId = 'test-client-id';
  const mockToken = 'header.eyJuYW1lIjoiVGVzdCBVc2VyIiwiaWQiOiIxIn0.signature'; // Mock JWT with payload { name: "Test User", id: "1" }
  const mockTokenPayload = { name: 'Test User', id: '1' };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockEnvironmentService = {
      get: jest.fn().mockReturnValue(mockGoogleClientId),
    } as any;

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);

    (global as any).google = mockGoogle;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EnvironmentService, useValue: mockEnvironmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).google;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Google Sign-In in ngOnInit', () => {
    fixture.detectChanges();
    expect(mockEnvironmentService.get).toHaveBeenCalledWith('googleClientId');
    expect(mockGoogle.accounts.id.initialize).toHaveBeenCalledWith({
      client_id: mockGoogleClientId,
      callback: expect.any(Function),
    });
    expect(mockGoogle.accounts.id.renderButton).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 250,
      }
    );
  });

  it('should handle login and navigate to accounts page', () => {
    fixture.detectChanges();
    const response = { credential: mockToken };
    component.handleLogin(response);
    expect(component['decodeToken'](mockToken)).toEqual(mockTokenPayload);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'tmsuser',
      JSON.stringify(mockTokenPayload)
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['accounts']);
  });

  it('should not navigate if response is empty', () => {
    fixture.detectChanges();
    component.handleLogin(null);
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should decode token correctly', () => {
    const decoded = component['decodeToken'](mockToken);
    expect(decoded).toEqual(mockTokenPayload);
  });
});
