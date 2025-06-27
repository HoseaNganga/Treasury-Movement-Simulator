import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteEntry } from './remote-entry';

describe('RemoteEntry', () => {
  let component: RemoteEntry;
  let fixture: ComponentFixture<RemoteEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
