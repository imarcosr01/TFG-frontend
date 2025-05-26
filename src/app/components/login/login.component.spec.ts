import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authMock: jasmine.SpyObj<AuthService>;
  let snackMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj('AuthService', ['login']);
    snackMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: MatSnackBar, useValue: snackMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login success navigates and shows snack', () => {
    authMock.login.and.returnValue(of({ token: 't', user: {} as any }));
    component.loginForm.setValue({ email: 'a@b.c', password: '1234' });
    component.onSubmit();
    expect(authMock.login).toHaveBeenCalledWith('a@b.c', '1234');
    expect(snackMock.open).toHaveBeenCalled();
  });

  it('login error shows snack', () => {
    authMock.login.and.returnValue(
      throwError(() => ({ error: { error: 'fail' } }))
    );
    component.loginForm.setValue({ email: 'a@b.c', password: '1234' });
    component.onSubmit();
    expect(snackMock.open).toHaveBeenCalledWith('fail', 'Cerrar', {
      duration: 3000
    });
  });
});
