import { RefObject } from 'react';
import { FlatList } from 'react-native';

import { LockingAction, LockCallback } from '../types';

export class AgendaRespondController implements LockingAction {
  #locked: boolean = false;

  #isRunning: boolean = false;

  #lockListener: LockCallback = () => {};

  #listRef: RefObject<FlatList<any>>;

  #unlockTimer: number = 0;

  constructor(list: RefObject<FlatList<any>>) {
    this.#listRef = list;
  }

  private notifyLockListener = (): void => {
    this.#lockListener(this.#isRunning, this);
  };

  private debouncedUnlocker = (time = 40): void => {
    clearTimeout(this.#unlockTimer);
    // @ts-ignore
    this.#unlockTimer = setTimeout(this.endRun, time);
  };

  private startRun = (): void => {
    this.#isRunning = true;
    this.notifyLockListener();
  };

  private endRun = (): void => {
    this.#isRunning = false;
    this.notifyLockListener();
  };

  scrollToOffset = (offset: number): void => {
    // console.log('scrollToOffset',offset, !!this.#listRef.current,this.isLocked);
    if (this.isLocked) return;
    this.startRun();
    this.#listRef.current?.scrollToOffset({ offset });
    this.debouncedUnlocker();
  };

  get isLocked(): boolean {
    return this.#locked;
  }

  // #region overrides
  lock = (): void => {
    // console.log('______________________ RESPONDER LOCK _____________________');
    this.#locked = true;
  };

  unlock = (): void => {
    // console.log('______________________ RESPONDER UNLOCK _____________________');
    this.#locked = false;
  };

  onLockListener = (cb): void => {
    this.#lockListener = cb;
  };

  // #region flatList props
  onViewableItemsChanged = (): void => {
    if (!this.#isRunning || this.#locked) return;
    this.debouncedUnlocker();
  };

  onScroll = (): void => {};

  onScrollBeginDrag = (): void => {};

  onMomentumScrollEnd = (): void => {};

  onScrollEndDrag = (): void => {};

  onMomentumScrollBegin = (): void => {};
  // #endregion
  // #endregion
}
