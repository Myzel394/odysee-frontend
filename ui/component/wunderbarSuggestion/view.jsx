// @flow
import React from 'react';
import classnames from 'classnames';
import { ComboboxOption } from '@reach/combobox';
import FileThumbnail from 'component/fileThumbnail';
import ChannelThumbnail from 'component/channelThumbnail';
import ClaimProperties from 'component/claimProperties';
import PremiumBadge from 'component/common/premium-badge';

type Props = {
  claim: ?Claim,
  uri: string,
  isResolvingUri: boolean,
  odyseeMembershipByUri: ?string,
};

export default function WunderbarSuggestion(props: Props) {
  const { claim, uri, isResolvingUri, odyseeMembershipByUri } = props;

  if (isResolvingUri) {
    return (
      <ComboboxOption value={uri}>
        <div className="wunderbar__suggestion">
          <div className="media__thumb media__thumb--resolving" />
        </div>
      </ComboboxOption>
    );
  }

  if (!claim) {
    return null;
  }

  const isChannel = claim.value_type === 'channel';
  const isCollection = claim.value_type === 'collection';

  return (
    <ComboboxOption value={uri}>
      <div
        className={classnames('wunderbar__suggestion', {
          'wunderbar__suggestion--channel': isChannel,
        })}
      >
        {isChannel && <ChannelThumbnail small uri={uri} />}
        {!isChannel && (
          <FileThumbnail uri={uri}>
            {isCollection && (
              <div className="claim-preview__claim-property-overlay">
                <ClaimProperties uri={uri} small iconOnly />
              </div>
            )}
          </FileThumbnail>
        )}
        <span className="wunderbar__suggestion-label">
          <div className="wunderbar__suggestion-title">{claim.value.title}</div>
          <div className="wunderbar__suggestion-name">
            {isChannel ? claim.name : (claim.signing_channel && claim.signing_channel.name) || __('Anonymous')}
            <PremiumBadge membership={odyseeMembershipByUri} />
          </div>
        </span>
      </div>
    </ComboboxOption>
  );
}
