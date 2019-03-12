import { FileExtDirective } from './styles/file-ext-directive';
import { ScrollableDirective } from './scrollable/scrollable.directive';


import { EmailValidatorDirective, PhoneValidatorDirective, RequiredIfValidatorDirective } from './validators';

export const DIRECTIVES = [
  ScrollableDirective,
  FileExtDirective,
  EmailValidatorDirective,
  PhoneValidatorDirective,
  RequiredIfValidatorDirective
];

export {
  ScrollableDirective,
  FileExtDirective,
  EmailValidatorDirective,
  PhoneValidatorDirective,
  RequiredIfValidatorDirective
};
