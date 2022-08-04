import React, { useCallback, useContext } from 'react';
import './help.styles.scss';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { config } from '../../resources/scripts/config';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS,
	UserDataContext
} from '../../globalState';
import { HelpVideoCallConsultant } from './HelpVideoCallConsultant';
import { HelpVideoCallAsker } from './HelpVideoCallAsker';
import { useTranslation } from 'react-i18next';

interface HelpProps {}
export const Help: React.FC<HelpProps> = () => {
	const { t: translate } = useTranslation();

	const { addNotification } = useContext(NotificationsContext);
	const { userData } = useContext(UserDataContext);

	const copyLoginLink = useCallback(async () => {
		await copyTextToClipboard(`${config.urls.toLogin}`, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,
				title: translate('help.videoCall.loginLink.notification.title'),
				text: translate('help.videoCall.loginLink.notification.text')
			});
		});
	}, [addNotification, translate]);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);

	return (
		<div className="help">
			{isConsultant && (
				<HelpVideoCallConsultant copyLoginLink={copyLoginLink} />
			)}
			{isAsker && <HelpVideoCallAsker copyLoginLink={copyLoginLink} />}
		</div>
	);
};
