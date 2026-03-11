import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService, ConfirmDialogData } from '../../services/confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrls: ['./confirm-modal.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  data: ConfirmDialogData | null = null;
  visible = false;
  private subscription: Subscription;

  constructor(private confirmService: ConfirmService) {
    this.subscription = this.confirmService.confirm$.subscribe((data) => {
      this.data = data;
      this.visible = !!data;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  confirm() {
    this.confirmService.respond(true);
    this.visible = false;
  }

  cancel() {
    this.confirmService.respond(false);
    this.visible = false;
  }
}