/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';

import 'dayjs/locale/fr';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('fr')
dayjs.extend(localizedFormat);
dayjs.extend(calendar);


dayjs.tz.setDefault(dayjs.tz.guess());

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
