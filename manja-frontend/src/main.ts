/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import dayjs from 'dayjs/esm';
import advancedFormat from 'dayjs/esm/plugin/advancedFormat';
import utc from 'dayjs/esm/plugin/utc';
import timezone from 'dayjs/esm/plugin/timezone';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import calendar from 'dayjs/esm/plugin/calendar';
import { enableProdMode } from '@angular/core';


import 'dayjs/locale/fr';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('fr')
dayjs.extend(localizedFormat);
dayjs.extend(calendar);


dayjs.tz.setDefault(dayjs.tz.guess());

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
