import {expectType} from 'tsd-check';
import loudRejection from '.';
import './register';

expectType<void>(loudRejection());
expectType<void>(loudRejection(console.log));
