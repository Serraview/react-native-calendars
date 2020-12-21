import { LayoutRectangle, LayoutChangeEvent } from 'react-native';
import { Callback } from '../types';

export class AgendaItemController {
  #rowsReady: boolean = false;

  #rowLayouts: Map<number, LayoutRectangle> = new Map();

  #onReady: Callback<void>;

  #days: number;

  constructor(daysInMonth: number, onReady) {
    this.#days = daysInMonth;
    this.#onReady = onReady;
  }

  onLayoutForIndex = (index: number) => ({
    nativeEvent: { layout },
  }: LayoutChangeEvent): void => {
    this.#rowLayouts.set(index, layout);
    if (this.#rowLayouts.size >= this.#days - 1) {
      this.#rowsReady = true;
      this.#onReady();
    }
  };

  getOffset = (index: number): number => {
    console.log('@getOffset', {ready:this.#rowsReady, index, itemController:this});
    let offset = 0;
    for (let i = 0; i <= index - 1; i++) {
      offset += this.#rowLayouts.get(i)?.height ?? 0;
    }

    return offset;
  };

  get isReady(): boolean {
    return this.#rowsReady;
  }

  get props(): any {
    return {
      onLayout: this.onLayoutForIndex,
    };
  }
}
