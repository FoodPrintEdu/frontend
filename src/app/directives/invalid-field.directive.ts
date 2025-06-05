import { Directive, Input, HostBinding } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[invalidField]',
  exportAs: 'invalidField', // 👈 allows use as #invalidField="invalidField"
})
export class InvalidFieldDirective {
  @Input('invalidField') control: AbstractControl | null = null;

  @HostBinding('class.ng-invalid')
  get addInvalidClass(): boolean {
    return this.isInvalid();
  }

  @HostBinding('class.ng-dirty')
  get addDirtyClass(): boolean {
    return this.isDirty();
  }

  isInvalid(): boolean {
    return !!(
      this.control?.invalid &&
      (this.control?.dirty || this.control?.touched)
    );
  }

  isDirty(): boolean {
    return !!(this.control?.dirty || this.control?.touched);
  }
}
