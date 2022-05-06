import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { selectGetSyncErrorMessage, selectSyncFatalError, selectSyncIsLocked } from 'redux/selectors/sync';
import { doUserSetReferrer } from 'redux/actions/user';
import * as PAGES from 'constants/pages';
import {
  selectOdyseeMembershipIsPremiumPlus,
  selectUser,
  selectUserLocale,
  selectUserVerifiedEmail,
  selectHomepageFetched,
} from 'redux/selectors/user';
import { selectUnclaimedRewards } from 'redux/selectors/rewards';
import {
  doFetchChannelListMine,
  doFetchCollectionListMine,
  doFetchLatestClaimForChannel,
  doResolveUri,
} from 'redux/actions/claims';
import { selectMyChannelClaimIds, selectClaimForUri, selectLatestClaimByUri } from 'redux/selectors/claims';
import { selectLanguage, selectLoadedLanguages, selectThemePath } from 'redux/selectors/settings';
import { selectModal, selectActiveChannelClaim, selectIsReloadRequired } from 'redux/selectors/app';
import { selectUploadCount } from 'redux/selectors/publish';
import { doSetLanguage } from 'redux/actions/settings';
import { doSyncLoop } from 'redux/actions/sync';
import { doSignIn, doSetIncognito } from 'redux/actions/app';
import { doFetchModBlockedList, doFetchCommentModAmIList } from 'redux/actions/comments';
import { selectActiveLiveClaimForChannel } from 'redux/selectors/livestream';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import { normalizeURI } from 'util/lbryURI';
import { generateGoogleCacheUrl } from 'util/url';
import App from './view';

const LATEST_PATH = `/$/${PAGES.LATEST}/`;
const LIVE_PATH = `/$/${PAGES.LIVE_NOW}/`;
const EMBED_PATH = `/$/${PAGES.EMBED}/`;

const select = (state, props) => {
  const { pathname, hash, search } = state.router.location;

  const urlPath = pathname + hash;
  const embedPath = urlPath.startsWith(EMBED_PATH);
  const urlParams = new URLSearchParams(search);
  const featureParam = urlParams.get('feature');
  const latestContentPath = urlPath.startsWith(LATEST_PATH) || (embedPath && featureParam === PAGES.LATEST);
  const liveContentPath = urlPath.startsWith(LIVE_PATH) || (embedPath && featureParam === PAGES.LIVE_NOW);
  const isNewestPath = latestContentPath || liveContentPath;

  let path;
  if (isNewestPath) {
    path = urlPath.replace(embedPath ? EMBED_PATH : latestContentPath ? LATEST_PATH : LIVE_PATH, '');
  } else {
    // Remove the leading "/" added by the browser
    path = urlPath.slice(1);
  }
  path = path.replace(/:/g, '#');

  if (isNewestPath && !path.startsWith('@')) {
    path = `@${path}`;
  }

  if (search && search.startsWith('?q=cache:')) {
    generateGoogleCacheUrl(search, path);
  }

  let uri;
  try {
    uri = normalizeURI(path);
  } catch (e) {
    const match = path.match(/[#/:]/);

    if (!path.startsWith('$/') && match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
    }
  }

  const claim = selectClaimForUri(state, uri);
  const { canonical_url: canonicalUrl, claim_id: claimId } = claim || {};
  const latestContentClaim = liveContentPath
    ? selectActiveLiveClaimForChannel(state, claimId)
    : selectLatestClaimByUri(state, canonicalUrl);
  const latestClaimUrl = latestContentClaim && latestContentClaim.canonical_url;

  return {
    uri,
    claimId,
    latestClaimUrl,
    latestContentPath,
    liveContentPath,
    isNewestPath,
    canonicalUrl,
    user: selectUser(state),
    locale: selectUserLocale(state),
    theme: selectThemePath(state),
    language: selectLanguage(state),
    languages: selectLoadedLanguages(state),
    isReloadRequired: selectIsReloadRequired(state),
    syncError: selectGetSyncErrorMessage(state),
    syncIsLocked: selectSyncIsLocked(state),
    uploadCount: selectUploadCount(state),
    rewards: selectUnclaimedRewards(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    currentModal: selectModal(state),
    syncFatalError: selectSyncFatalError(state),
    activeChannelClaim: selectActiveChannelClaim(state),
    myChannelClaimIds: selectMyChannelClaimIds(state),
    hasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
    homepageFetched: selectHomepageFetched(state),
  };
};

const perform = {
  fetchChannelListMine: doFetchChannelListMine,
  fetchCollectionListMine: doFetchCollectionListMine,
  setLanguage: doSetLanguage,
  signIn: doSignIn,
  syncLoop: doSyncLoop,
  setReferrer: doUserSetReferrer,
  setIncognito: doSetIncognito,
  fetchModBlockedList: doFetchModBlockedList,
  fetchModAmIList: doFetchCommentModAmIList,
  doResolveUri,
  fetchLatestClaimForChannel: doFetchLatestClaimForChannel,
  fetchChannelLiveStatus: doFetchChannelLiveStatus,
};

export default hot(connect(select, perform)(App));
