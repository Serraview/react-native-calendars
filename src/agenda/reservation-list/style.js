import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginVertical:2,
      paddingVertical:8
    },
    innerContainer: {
      flex: 1
    },
    dayNum: {
      fontSize: 28,
      fontWeight: '200',
      fontFamily: appStyle.textDayFontFamily,
      color: appStyle.agendaDayNumColor
    },
    dayText: {
      fontSize: 14,
      fontWeight: appStyle.textDayFontWeight,
      fontFamily: appStyle.textDayFontFamily,
      color: appStyle.agendaDayTextColor,
      backgroundColor: 'rgba(0,0,0,0)',
      marginTop: -5,
      opacity:0.5
    },
    day: {
      width: 63,
      alignItems: 'center',
      justifyContent: 'flex-start',
      // marginTop: 8,
    },
    today: {
      color: appStyle.agendaTodayColor
    },
    indicator: {
      marginTop: 80
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
