import { Dayjs } from "dayjs";
import { MONTHS_FRENCH } from "../constants/constants";

export interface CalendarDate {
  value: Dayjs;
  isPriorToCurrent: boolean;
  belongsToMonth: boolean;
  isCurrentDate: boolean;
  isOpenDay: boolean;
  selectable: boolean;
  selected: boolean;
  isHighlighted: boolean;
}

export type Month = (typeof MONTHS_FRENCH)[number];