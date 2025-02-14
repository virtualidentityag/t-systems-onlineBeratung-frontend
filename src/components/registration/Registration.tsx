import '../../polyfill';
import * as React from 'react';
import unionBy from 'lodash/unionBy';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getUrlParameter } from '../../utils/getUrlParameter';
import { WelcomeScreen } from './WelcomeScreen';
import { InformalContext } from '../../globalState';
import { RegistrationForm } from './RegistrationForm';
import '../../resources/styles/styles';
import { StageLayout } from '../stageLayout/StageLayout';
import useIsFirstVisit from '../../utils/useIsFirstVisit';
import { useTranslation } from 'react-i18next';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { UrlParamsContext } from '../../globalState/provider/UrlParamsProvider';
import { useAppConfig } from '../../hooks/useAppConfig';

export const Registration = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);

	const { consultingTypeSlug } = useParams<{ consultingTypeSlug: string }>();

	const agencyId = getUrlParameter('aid');
	const consultantId = getUrlParameter('cid');
	const postcodeParameter = getUrlParameter('postcode');
	const settings = useAppConfig();

	const { setInformal } = useContext(InformalContext);
	const { Stage } = useContext(GlobalComponentContext);

	const loginParams = Object.entries({
		cid: consultantId,
		aid: agencyId
	})
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(
		postcodeParameter === null
	);

	const [isReady, setIsReady] = useState(false);

	const handleForwardToRegistration = () => {
		setShowWelcomeScreen(false);
		window.scrollTo({ top: 0 });
	};

	const { agency, consultingType, consultant, topic, loaded } =
		useContext(UrlParamsContext);

	useEffect(() => {
		if (!loaded) {
			return;
		}

		if (!consultingType && !agency && !consultant && !topic) {
			console.error(
				'No `consultingType`, `consultant`, `agency` or `topic` found in URL.'
			);
			window.location.href = settings.urls.toRegistration;
			return;
		}

		try {
			if (consultant) {
				// If all consultant agencies are informal then use informal
				const isInformal = consultant.agencies.every(
					(agency) => !agency.consultingTypeRel.languageFormal
				);
				setInformal(isInformal);

				// If consultant has only one consulting type set document title
				const hasUniqueConsultingType =
					unionBy(consultant.agencies, 'consultingType').length > 1;

				if (hasUniqueConsultingType) {
					document.title = `${translate(
						'registration.title.start'
					)} ${translate(
						[
							`consultingType.${consultant.agencies[0].consultingTypeRel.id}.titles.long`,
							consultant.agencies[0].consultingTypeRel.titles.long
						],
						{ ns: 'consultingTypes' }
					)}`;
				}
			} else {
				if (
					consultingType.urls?.requiredAidMissingRedirectUrl &&
					!agency
				) {
					window.location.href =
						consultingType.urls?.requiredAidMissingRedirectUrl;
					throw new Error(`Consulting type requires matching aid`);
				}

				// SET FORMAL/INFORMAL
				setInformal(!consultingType.languageFormal);

				document.title = `${translate(
					'registration.title.start'
				)} ${translate(
					[
						`consultingType.${consultingType.id}.titles.long`,
						consultingType.titles.long
					],
					{ ns: 'consultingTypes' }
				)}`;
			}
			setIsReady(true);
		} catch (error) {
			console.log(error);
			return;
		}
	}, [
		consultingType,
		agency,
		consultant,
		loaded,
		consultingTypeSlug,
		translate,
		setInformal,
		settings.urls.toRegistration,
		topic
	]);

	const isFirstVisit = useIsFirstVisit();

	return (
		<StageLayout
			showLegalLinks={true}
			showLoginLink={!showWelcomeScreen}
			stage={<Stage hasAnimation={isFirstVisit} isReady={isReady} />}
			loginParams={loginParams}
		>
			{isReady &&
				(showWelcomeScreen ? (
					<WelcomeScreen
						title={translate('registration.overline')}
						handleForwardToRegistration={
							handleForwardToRegistration
						}
						loginParams={loginParams}
						welcomeScreenConfig={consultingType?.welcomeScreen}
						consultingTypeId={consultingType?.id}
					/>
				) : (
					<RegistrationForm />
				))}
		</StageLayout>
	);
};
