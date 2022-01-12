import { connect } from 'react-redux';
import { selectTotalBalance } from 'redux/selectors/wallet';
import { doOpenModal } from 'redux/actions/app';
import OdyseeMembership from './view';

const select = (state) => ({
  totalBalance: selectTotalBalance(state),
});

export default connect(select, {
  doOpenModal,
})(OdyseeMembership);