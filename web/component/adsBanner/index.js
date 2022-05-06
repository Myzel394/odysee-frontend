import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetAdBlockerFound } from 'redux/actions/app';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectOdyseeMembershipIsPremiumPlus } from 'redux/selectors/user';
import AdsBanner from './view';

const select = (state, props) => ({
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
});

const perform = {
  doSetAdBlockerFound,
};

export default connect(select, perform)(AdsBanner);
