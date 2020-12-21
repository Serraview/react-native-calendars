import React, { ReactElement, memo } from 'react';
import NakedCalendar from './Calendar/Calendar';
import WeekWrapper from './Calendar/WeekWrapper';
import MonthWrapper from './Calendar/MonthWrapper';

import NakedAgenda from './Agenda/Agenda';
import AgendaItem from './Agenda/Item';

import DimensionWrapper from '../containers/CalendarDimensions';
import AgendaController from '../containers/AgendaListController';

function CalendarWithDimension(props: any): ReactElement {
  return (
    <DimensionWrapper key="prepack_calendar_dimension_provider" {...props}>
      <NakedCalendar key="wrapped_calendar" />
    </DimensionWrapper>
  );
}
function AgendaWithController(props: any): ReactElement {
  return (
    <AgendaController key="prepack_agenda_controller_provider" {...props}>
      <NakedAgenda key="wrapped_agenda" />
    </AgendaController>
  );
}

const Calendar = memo(CalendarWithDimension);
const Agenda = memo(AgendaWithController);

export { Calendar, WeekWrapper, MonthWrapper, Agenda, AgendaItem, NakedAgenda };
