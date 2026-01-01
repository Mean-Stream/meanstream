import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

const DESTROY = Symbol();

@Component({
  selector: 'ngbx-modal',
  exportAs: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() size?: 'sm' | 'lg' | 'xl' | string;
  @Input() scrollable?: boolean;
  @Input() locked?: boolean;

  @Input() back: any[] = [{outlets: {modal: null}}];
  @Input() backOptions?: NavigationExtras;

  @ViewChild('modal', {static: true}) modal!: TemplateRef<any>;
  openModal?: NgbModalRef;

  @Output() modalClose = new EventEmitter<any>();

  private modalService = inject(NgbModal);
  private router = inject(Router);

  constructor(

  ) {
    this.backOptions ||= {relativeTo: route};
  }

  ngOnInit() {
    this.openModal = this.modalService.open(this.modal, {
      ariaLabelledBy: 'title',
      size: this.size,
      scrollable: this.scrollable,
      beforeDismiss: () => !this.locked,
    });

    const handler = (result: any) => {
      if (result === DESTROY) {
        this.modalClose.next(undefined);
      } else {
        this.router.navigate(this.back, this.backOptions);
        this.modalClose.next(result);
      }
    };
    this.openModal.result.then(handler, handler);
  }

  ngOnDestroy(): void {
    this.openModal?.dismiss(DESTROY);
  }

  close(event?: any): void {
    this.openModal?.close(event);
  }
}
