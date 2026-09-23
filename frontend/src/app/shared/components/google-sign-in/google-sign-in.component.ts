import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../../models/compass.models';

@Component({
  selector: 'app-google-sign-in',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full flex justify-center">
      <div #buttonContainer class="w-full min-h-[44px] flex items-center justify-center"></div>
    </div>
  `,
})
export class GoogleSignInComponent implements AfterViewInit {
  private auth = inject(AuthService);

  @ViewChild('buttonContainer', { static: true })
  buttonContainer!: ElementRef<HTMLDivElement>;

  @Input() text: 'continue_with' | 'signin_with' | 'signup_with' = 'continue_with';
  @Input() theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline';
  @Input() size: 'large' | 'medium' | 'small' = 'large';

  @Output() signedIn = new EventEmitter<UserProfile>();
  @Output() signInError = new EventEmitter<any>();

  ngAfterViewInit(): void {
    if (this.buttonContainer?.nativeElement) {
      this.auth.renderGoogleButton(
        this.buttonContainer.nativeElement,
        {
          onSuccess: (user) => this.signedIn.emit(user),
          onError: (err) => this.signInError.emit(err),
        },
        {
          text: this.text,
          theme: this.theme,
          size: this.size,
          width: this.buttonContainer.nativeElement.clientWidth || 320,
        }
      );
    }
  }
}
