import _ from 'lodash';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component} from 'react';
import {FlatList, ActivityIndicator, View} from 'react-native';
import {extractComponentProps} from '../../component-updater';
import dateutils from '../../dateutils';
import styleConstructor from './style';
import Reservation from './reservation';

class ReservationList extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Reservation.propTypes,
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
     the value of date key kas to be an empty array []. If there exists no value for date key it is
     considered that the date in question is not yet loaded */
    reservations: PropTypes.object,
    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate),
    /** Show items only for the selected day. Default = false */
    showOnlySelectedDayItems: PropTypes.bool,
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange: PropTypes.func,
    /** specify what should be rendered instead of ActivityIndicator */
    renderEmptyData: PropTypes.func,

    /** onScroll ListView event */
    onScroll: PropTypes.func,
    /** Called when the user begins dragging the agenda list **/
    onScrollBeginDrag: PropTypes.func,
    /** Called when the user stops dragging the agenda list **/
    onScrollEndDrag: PropTypes.func,
    /** Called when the momentum scroll starts for the agenda list **/
    onMomentumScrollBegin: PropTypes.func,
    /** Called when the momentum scroll stops for the agenda list **/
    onMomentumScrollEnd: PropTypes.func,
    /** A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView */
    refreshControl: PropTypes.element,
    /** Set this true while waiting for new data from a refresh */
    refreshing: PropTypes.bool,
    /** If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly */
    onRefresh: PropTypes.func
  };

  static defaultProps = {
    refreshing: false,
    selectedDay: XDate(true)
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.state = {
      reservations: [],
      heights: []
    };

    this.scrollOver = true;
    this.noUpdate = false;
    this.isTouched = false;
    this.needToScroll = false;
  }

  componentDidMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (!dateutils.sameMonth(prevProps.selectedDay, this.props.selectedDay)) {
        this.setState(
            {
              reservations: [],
              heights : []
            },
            () => this.updateReservations(this.props)
        );
      }
      if (!dateutils.sameDate(prevProps.selectedDay, this.props.selectedDay)) {
        this.needToScroll = true;
      }
    }

  }

  updateDataSource(reservations) {
    this.setState({ reservations });
  }

  updateReservations(props) {
    const reservations = this.getReservations(props);
    this.updateDataSource(reservations.reservations);
  }

  getReservationsForDay(iterator, props) {
    const day = iterator.clone();
    const res = props.reservations[day.toString('yyyy-MM-dd')];
    if (res && res.length) {
      const out = res.reduce(
        (acc, v) => {
          acc.reservation.push(v);
          return acc;
        },
        {
          reservation: [],
          date: day,
          day
        },
      );
      return out;
    } else if (res) {
      return [
        {
          date: iterator.clone(),
          day
        }
      ];
    } else {
      return false;
    }
  }

  getReservations(props) {
    const {selectedDay} = props;
    if (!props.reservations || !selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }

    let reservations = [];
    let iterator = new XDate(props.currentMonth);

    if (this.state.reservations && this.state.reservations.length) {
      iterator = this.state.reservations[0].day.clone();

      while (iterator.getTime() < selectedDay.getTime()) {
        const res = this.getReservationsForDay(iterator, props);
        if (!res) {
          reservations = [];
          break;
        } else {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }
    }

    const scrollPosition = reservations.length;
      for (let i = 0; i < 31; i++) {
        const res = this.getReservationsForDay(iterator, props);

        if (res) {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }

    return {reservations, scrollPosition};
  }

  updateScrollPosition = () => {
    if (this.isTouched || this.noUpdate) return;
    if (!this.list) return;

    if( this.state.heights.length !== this.state.reservations.length) {
      this.needToScroll = true;
      return;
    }
    let scrollPosition = 0;
    const toDay = this.props.selectedDay.getDate();
    for (let i = 0; i < toDay - 1; i++) {
      scrollPosition += this.state.heights[i] || 0;
    }
    this.scrollOver = false;
    if (this.list){
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
      this.needToScroll = false;
    }

  };

  onScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    _.invoke(this.props, 'onScroll', yOffset);

    let topRowOffset = 0;
    let topRow;
    const heights = this.state.heights;
    for (topRow = 0; topRow < heights.length; topRow++) {
      if (topRowOffset + heights[topRow] * 0.7 >= yOffset) {
        break;
      }
      topRowOffset += heights[topRow];
    }

    const row = this.state.reservations[topRow];
    if (!row) return;

    if (
      topRowOffset + heights[topRow] * 0.1 <= yOffset &&
        topRowOffset + heights[topRow] * 0.95 >= yOffset &&
        this.listHeight < heights[topRow]
    ) {
      this.noUpdate = true;
    } else {
      this.noUpdate = false;
    }

    const day = row.day;
    const sameDate = dateutils.sameDate(day, this.props.selectedDay);
    if (!sameDate && this.scrollOver && !this.forcedScrolling) {
      this.forcedScrolling = false;
      _.invoke(this.props, 'onDayChange', day.toDate());
    }
  };

  onListTouch() {
    this.scrollOver = true;
  }

  onRowLayoutChange(ind, event) {
    const newHeight = [...this.state.heights];
    newHeight[ind] = event.nativeEvent.layout.height;

    this.setState(
        {
          reservations: this.state.reservations,
          heights : newHeight
        }
    );
  }

  onMoveShouldSetResponderCapture = () => {
    this.onListTouch();
    this.isTouched = true;
    this.forcedScrolling = false;
    return false;
  };

  renderRow = ({item, index}) => {
    const reservationProps = extractComponentProps(Reservation, this.props);

    if( this.state.heights.length === this.state.reservations.length && this.needToScroll) {
      this.updateScrollPosition();
    }

    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation {...reservationProps} item={item}/>
      </View>
    );
  };

  render() {
    const {reservations, selectedDay, theme, style} = this.props;
    if (!reservations || !reservations[selectedDay.toString('yyyy-MM-dd')]) {
      if (_.isFunction(this.props.renderEmptyData)) {
        return _.invoke(this.props, 'renderEmptyData');
      }

      return <ActivityIndicator style={this.style.indicator} color={theme && theme.indicatorColor}/>;
    }

    return (
      <FlatList
          ref={(c) => {
            if (!this.list) {
              this.list = c;
              this.updateScrollPosition();
            } else this.list = c;
          }}
          initialNumToRender={31}
        style={style}
        contentContainerStyle={this.style.content}
        data={this.state.reservations}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture}
        onScroll={this.onScroll}
        refreshControl={this.props.refreshControl}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
        onScrollBeginDrag={() => {
          this.isTouched = true;
          this.forcedScrolling = false;
          this.onListTouch();
        }}
        onScrollEndDrag={({nativeEvent}) => {
          if (!this.isTouched || nativeEvent.velocity.y !== 0) return;
          this.scrollOver = false;
          this.isTouched = false;
          this.updateScrollPosition();
          this.forcedScrolling = false;
        }}
        onMomentumScrollBegin={this.props.onMomentumScrollBegin}
        onMomentumScrollEnd={this.props.onMomentumScrollEnd}
      />
    );
  }
}

export default ReservationList;
