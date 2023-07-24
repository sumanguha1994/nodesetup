'use strict';

import { FormControl, FormGroup } from '@angular/forms';

export const API_URL = 'http://localhost:5000/api';
export const APP_NAME = 'Admin';

export function getValidationMessage(result: any[]) {
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const element = result[key];
      if (element.message) {
        return element.message;
      }
    }
  }
}

export function getServerErrorMessage(err: any) {
  if (err.status == 401) {
    return err?.error?.message ?? 'Unauthorized Action';
  } else if (err.status == 404) {
    return err?.message ?? 'Not found exception occured';
  } else {
    return 'Internal server error occured. Please try again later';
  }
}

/**
 * ----------------------------------------
 * Form Control Global Functions
 * @param formGroup - Instance of FormGroup
 * ----------------------------------------
 * ----------------------------------------
 */

export function isInputValid(formGroup: FormGroup, control: any) {
  let valid: boolean = true;
  if (
    !['VALID', 'DISABLED'].includes(formGroup.controls[control].status) &&
    (formGroup.controls[control].touched || formGroup.controls[control].dirty)
  ) {
    valid = false;
  }

  return valid;
}

export function isInputRuleValid(
  formGroup: FormGroup,
  control: any,
  rule: any
) {
  let valid: boolean = true;

  if (rule instanceof Array) {
    rule.forEach((r) => {
      if (
        formGroup.controls[control].hasError(r) &&
        (formGroup.controls[control].touched ||
          formGroup.controls[control].dirty)
      ) {
        valid = false;
      }
    });
  } else {
    if (
      formGroup.controls[control].hasError(rule) &&
      (formGroup.controls[control].touched || formGroup.controls[control].dirty)
    ) {
      valid = false;
    }
  }

  return valid;
}

export function isInputRuleAvailable(
  formGroup: FormGroup,
  control: any,
  rule: any
) {
  const formControl: any = formGroup.get(control);
  if (formControl) {
    const validator = formControl.validator && formControl.validator(new FormControl());
    if (validator && validator[rule]) {
      return true;
    }
  }

  return false;
}

export function resetForm(formGroup: FormGroup) {
  formGroup.reset();
  for (const key in formGroup.controls) {
    if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
      const element = formGroup.controls[key];

      element.markAsUntouched();
      element.markAsPristine();
    }
  }
}

export function scrollToQuery(query: any) {
  let $_errFormControl = document.querySelectorAll(query);
  if ($_errFormControl.length > 0) {
    const firstErr: Element = $_errFormControl[0];
    firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
