import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeScreenComponent } from './home-screen.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBynasjPx0H8Ds0Z-6kxbaE0Mfkt26KPg0",
  authDomain: "e-commerce-a2486.firebaseapp.com",
  projectId: "e-commerce-a2486",
  storageBucket: "e-commerce-a2486.firebasestorage.app",
  messagingSenderId: "105605320394",
  appId: "1:105605320394:web:0a89e2ca6c744612746e33",
  measurementId: "G-Y6RZKPM1VV"
};

describe('HomeScreenComponent', () => {
  let component: HomeScreenComponent;
  let fixture: ComponentFixture<HomeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeScreenComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
