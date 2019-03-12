import { DynamicPipe } from './dynamic/dynamic.pipe';
import { ExpiredPipe } from './expired/expired.pipe';
import { GenderConverterPipe } from './gender-converter/gender-converter.pipe';
import { LookupValueConverterPipe } from './lookup-value-converter/lookup-value-converter.pipe';
import { SsnPipe } from './ssn/ssn.pipe';
import { YesNoPipe } from './ssn/yes-no/yes-no.pipe';
import { ActivePipe } from './calendar/active/active-pipe'
import { PhonePipe } from './phone/phone.pipe';
import { CapitalizeFirstPipe } from './capitalize/capitalize.pipe';

export const PIPES = [
  DynamicPipe,
  ExpiredPipe,
  GenderConverterPipe,
  LookupValueConverterPipe,
  SsnPipe,
  YesNoPipe,
  ActivePipe,
  PhonePipe,
  CapitalizeFirstPipe
];

export {
  DynamicPipe,
  ExpiredPipe,
  GenderConverterPipe,
  LookupValueConverterPipe,
  SsnPipe,
  YesNoPipe,
  PhonePipe,
  ActivePipe,
  CapitalizeFirstPipe
};
