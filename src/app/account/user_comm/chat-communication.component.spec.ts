import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCommunicationComponent } from './chat-communication.component';

describe('ChatCommunicationComponent', () => {
  let component: ChatCommunicationComponent;
  let fixture: ComponentFixture<ChatCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatCommunicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
