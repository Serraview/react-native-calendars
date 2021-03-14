import { createContext } from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';
import { AgendaListController, Day } from '../utils';
import { ParsedCalendarEvent, Callback, RenderProp } from '../utils/types';

export type AgendaControlOnItemEventPressed = Callback<ParsedCalendarEvent>;

export type AgendaControllerPassedProps = {
  itemRenderer?: RenderProp;
  eventRenderer?: RenderProp;
  // onDateSelected?: Callback<Date>;
  onDateChange?: Callback<Date>;
  onItemPressed?: Callback<Day & { events: ParsedCalendarEvent[] }>;
  onItemEventPressed?: AgendaControlOnItemEventPressed;
};

export type AgendaControllerExistingProps<ItemT> = {
  data: ReadonlyArray<ItemT> | null | undefined;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderItem: ListRenderItem<ItemT> | null | undefined;
};
export type AgendaControllerOmittedFlatListProps<ItemT = any> = Omit<
  Omit<FlatListProps<ItemT>, keyof AgendaControllerExistingProps<ItemT>>,
  keyof AgendaControllerPassedProps
>;

export type AgendaControllerOtherProps = AgendaControllerPassedProps & {
  otherProps?: AgendaControllerOmittedFlatListProps;
};
export interface IAgendaControllerCtx {
  listController: AgendaListController | null;
  props: AgendaControllerOtherProps;
}
export const AgendaControllerCtx = createContext<IAgendaControllerCtx>({
  listController: null,
  props: {},
});
