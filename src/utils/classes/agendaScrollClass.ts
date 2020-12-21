import { RefObject } from 'react';
import { FlatList, Platform } from 'react-native';
import invariant from 'ts-invariant';
import { LockingAction, LockCallback } from '../types';

export class AgendaScrollController implements LockingAction {
  #isDrag: boolean = false;

  #locked: boolean = false;

  #lockListener: LockCallback = () => {};

  #listRef: RefObject<FlatList<any>>;

  #timer: number = 0;

  constructor(list: RefObject<FlatList<any>>) {
    this.#listRef = list;
  }

  private notifyLockListener = (): void => {
    this.#lockListener(this.#isDrag, this);
  };

  private onDragStart = (): void => {
    invariant(!this.#locked, 'Controller is locked, drag should be disabled');
    this.#isDrag = true;
    this.notifyLockListener();
  };

  private onDragEnd = (): void => {
    invariant(!this.#locked, 'Controller is locked, drag should be disabled');

    if (this.#isDrag) {
      // because onViewableItemsChanged is called a tick later then onScrollDragEnd/onMomentumScrollEnd
      // we call unlock through timeout
      // this way AgendaController will still think that user is dragging and will call onViewableItemsChanged
      // check AgendaListController/onViewableItemsChanged
      setTimeout(() => {
        this.#isDrag = false;
        this.notifyLockListener();
      }, 50);
    }
  };

  /**
   * This is used to repeat action that could not be triggered for some reason immediately.
   * Only one action is accepted ( last one)
   * @param func
   * @param time
   * @param args
   */
  private tick = (func: Function, time: number, ...args: any[]): void => {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(func, time, ...args);
  };

  get isActive(): boolean {
    return this.#isDrag;
  }

  // #region overrides

  onLockListener = (cb): void => {
    this.#lockListener = cb;
  };

  lock = (): void => {
    // console.log('______________________ SCROLL LOCK _____________________');
    this.#locked = true;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: false,
    });
  };

  unlock = (): void => {
    // console.log('______________________ SCROLL UNLOCK _____________________');
    this.#locked = false;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: true,
    });
  };

  // #region flatList props

  onScroll = (): void => {};

  onViewableItemsChanged = (): void => {};

  onScrollBeginDrag = (): void => {
    this.onDragStart();
  };

  onMomentumScrollEnd = (): void => {
    this.onDragEnd();
  };

  onScrollEndDrag = (): void => {
    if (Platform.OS === 'ios') {
      this.tick(this.onDragEnd, 50);
    }
  };

  onMomentumScrollBegin = (): void => {
    if (Platform.OS === 'ios' && this.#timer) {
      clearTimeout(this.#timer);
    }
  };
}
