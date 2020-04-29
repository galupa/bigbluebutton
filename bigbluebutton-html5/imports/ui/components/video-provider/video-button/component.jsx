import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import VideoService from '../service';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';
import { validIOSVersion } from '/imports/ui/components/app/service';

const intlMessages = defineMessages({
  joinVideo: {
    id: 'app.video.joinVideo',
    description: 'Join video button label',
  },
  leaveVideo: {
    id: 'app.video.leaveVideo',
    description: 'Leave video button label',
  },
  videoButtonDescOn: {
    id: 'app.video.videoButtonDescOn',
    description: 'video button description',
  },
  videoButtonDescOff: {
    id: 'app.video.videoButtonDescOff',
    description: 'video button description',
  },
  videoLocked: {
    id: 'app.video.videoLocked',
    description: 'video disabled label',
  },
  iOSWarning: {
    id: 'app.iOSWarning.label',
    description: 'message indicating to upgrade ios version',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  hasVideoStream: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  mountVideoPreview: PropTypes.func.isRequired,
};

const JoinVideoButton = ({
  intl,
  hasVideoStream,
  isDisabled,
  mountVideoPreview,
}) => {
  const exitVideo = () => hasVideoStream && !VideoService.isMultipleCamerasEnabled();

  const handleOnClick = () => {
    if (!validIOSVersion()) {
      return VideoService.notify(intl.formatMessage(intlMessages.iOSWarning));
    }

    if (exitVideo()) {
      VideoService.exitVideo();
    } else {
      mountVideoPreview();
    }
    return null;
  };

  const label = exitVideo()
    ? intl.formatMessage(intlMessages.leaveVideo)
    : intl.formatMessage(intlMessages.joinVideo);
  const ariaLabel = hasVideoStream
    ? intl.formatMessage(intlMessages.videoButtonDescOn)
    : intl.formatMessage(intlMessages.videoButtonDescOff);

  return (
    <Button
      data-test="joinVideo"
      label={isDisabled ? intl.formatMessage(intlMessages.videoLocked) : label}
      className={cx(styles.button, hasVideoStream || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      aria-label={ariaLabel}
      color={hasVideoStream ? 'primary' : 'default'}
      icon={hasVideoStream ? 'video' : 'video_off'}
      ghost={!hasVideoStream}
      size="lg"
      circle
      disabled={isDisabled}
    />
  );
};

JoinVideoButton.propTypes = propTypes;

export default injectIntl(memo(JoinVideoButton));
