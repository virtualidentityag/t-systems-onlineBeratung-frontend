import React, { createContext, PropsWithChildren, useMemo } from 'react';
import {
	AgencyDataInterface,
	ConsultantDataInterface,
	ConsultingTypeInterface
} from '..';
import useUrlParamsLoader from '../../utils/useUrlParamsLoader';
import { TopicsDataInterface } from '../interfaces/TopicsDataInterface';

export const UrlParamsContext = createContext<{
	agency: AgencyDataInterface | null;
	consultingType: ConsultingTypeInterface | null;
	consultant: ConsultantDataInterface | null;
	topic: TopicsDataInterface | null;
	loaded: boolean;
	slugFallback: string;
}>({
	agency: null,
	consultingType: null,
	consultant: null,
	topic: null,
	loaded: false,
	slugFallback: undefined
});

export const UrlParamsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { agency, consultingType, consultant, topic, loaded, slugFallback } =
		useUrlParamsLoader();

	const context = useMemo(
		() => ({
			agency,
			consultingType,
			consultant,
			topic,
			loaded,
			slugFallback
		}),
		[agency, consultingType, consultant, topic, loaded, slugFallback]
	);

	return (
		<UrlParamsContext.Provider value={context}>
			{children}
		</UrlParamsContext.Provider>
	);
};
