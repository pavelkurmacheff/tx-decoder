import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isHexString } from 'ethers/lib/utils';

export function isHex(control: AbstractControl): ValidationErrors | null {
    return !control.value || isHexString(control.value) ? null : { isNotHex: true };
}
