import * as React from 'react';
import { Children, ReactNode, ReactElement, useContext } from 'react';
import { config } from '../../resources/scripts/config';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import './StageLayout.styles.scss';
import clsx from 'clsx';
import { LocaleContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch';
import { isMobile } from 'react-device-detect';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';

interface StageLayoutProps {
	className?: string;
	children: ReactNode;
	stage: ReactNode;
	showLegalLinks?: boolean;
	showLoginLink?: boolean;
	loginParams?: string;
}

export const StageLayout = ({
	className,
	children,
	stage,
	showLegalLinks,
	showLoginLink,
	loginParams
}: StageLayoutProps) => {
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const { selectableLocales } = useContext(LocaleContext);

	return (
		<div className={clsx('stageLayout', className)}>
			{React.cloneElement(Children.only(stage as ReactElement), {
				className: 'stageLayout__stage'
			})}
			<div className={`stageLayout__header ${isMobile ? 'mobile' : ''}`}>
				{selectableLocales.length > 1 && (
					<div>
						<LocaleSwitch />
					</div>
				)}
				{showLoginLink && (
					<div className="stageLayout__toLogin">
						<div className="stageLayout__toLogin__button">
							<a
								href={`${config.urls.toLogin}${
									loginParams ? `?${loginParams}` : ''
								}`}
								tabIndex={-1}
							>
								<Button
									item={{
										label: translate(
											'registration.login.label'
										),
										type: 'TERTIARY'
									}}
									isLink
								/>
							</a>
						</div>
					</div>
				)}
			</div>

			<div className="stageLayout__content">
				{children}
				{showLegalLinks && (
					<div className={`stageLayout__legalLinks`}>
						{legalLinks.map((legalLink, index) => (
							<React.Fragment key={legalLink.url}>
								{index > 0 && (
									<Text
										type="infoSmall"
										className="stageLayout__legalLinksSeparator"
										text=" | "
									/>
								)}
								<button
									type="button"
									className="button-as-link"
									data-cy-link={legalLink.url}
									onClick={() =>
										window.open(legalLink.url, '_blank')
									}
								>
									<Text
										className="stageLayout__legalLinksItem"
										type="infoSmall"
										text={translate(legalLink.label)}
									/>
								</button>
							</React.Fragment>
						))}
					</div>
				)}
			</div>
			{showLoginLink && (
				<div className="stageLayout__toLogin">
					<div className="stageLayout__toLogin__button">
						<a
							href={`${config.urls.toLogin}${
								loginParams ? `?${loginParams}` : ''
							}`}
							tabIndex={-1}
						>
							<Button
								item={{
									label: translate(
										'registration.login.label'
									),
									type: 'TERTIARY'
								}}
								isLink
							/>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};
