import {expectType} from 'tsd';
import loudRejection = require('.');
import './register';

expectType<void>(loudRejection());
expectType<void>(loudRejection(console.log));
