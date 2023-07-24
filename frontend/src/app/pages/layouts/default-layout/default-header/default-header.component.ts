import { Component, Input } from '@angular/core';
import { HeaderComponent } from '@coreui/angular';
import {
  cilMenu,
  cilUser,
  cilSettings,
  cilLockLocked,
  cilEnvelopeOpen,
  cilList,
  cilBell,
} from '@coreui/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  icons = {
    cilMenu,
    cilUser,
    cilSettings,
    cilLockLocked,
    cilEnvelopeOpen,
    cilList,
    cilBell,
  };

  constructor(private authService: AuthService) {
    super();
  }

  onLogout() {
    this.authService.adminLogout();
  }
}
