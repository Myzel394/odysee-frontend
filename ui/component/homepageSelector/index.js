import { connect } from 'react-redux';
import SelectHomepage from './view';
import { doSetHomepage } from 'redux/actions/settings';
import { selectHomepageCode, selectHomepageKeys } from 'redux/selectors/settings';

const select = (state) => ({
  homepage: selectHomepageCode(state),
  homepageKeys: selectHomepageKeys(state),
});

const perform = (dispatch) => ({
  setHomepage: (value) => dispatch(doSetHomepage(value)),
});

export default connect(select, perform)(SelectHomepage);
