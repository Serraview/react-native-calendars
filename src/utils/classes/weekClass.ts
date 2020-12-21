import { addDays, format } from 'date-fns';
import { DateComponent, IDateComponent } from './classHelpers';
import { Day } from './dayClass';

const SIMPLE_FORMAT = 'dd-MM-yyyy';

export interface IWeekClass extends IDateComponent {}

export class Week extends DateComponent {
  // here date is used to get first day of the week

  days: Day[] = [];

  constructor(data: IWeekClass) {
    super(data);
    this.type = '__week';

    this.key = `${data.keyExtender || ''}${this.type}_${format(
      this.date,
      SIMPLE_FORMAT
    )}`;
    this.keyExtender = this.key;

    this.constructWeek();
  }

  constructWeek = (): void => {
    new Array(7).fill(0).forEach((_, i) => {
      this.days.push(new Day({ date: addDays(this.date, i) }));
    });
  };
}
