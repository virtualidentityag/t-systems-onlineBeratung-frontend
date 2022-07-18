import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const SETTING_E2E_ENABLE = 'E2E_Enable';

export interface ISetting {
	_id: typeof SETTING_E2E_ENABLE | string;
	enterprise: boolean;
	value: any;
}

type TRocketChatSettingsPublicResponse = {
	count: number;
	offset: number;
	total: number;
	success: boolean;
	settings: ISetting[];
};

export const apiRocketChatSettingsPublic = async (
	settingsEntries: string[] = null
): Promise<TRocketChatSettingsPublicResponse> => {
	const url = config.endpoints.rc.settings.public;
	const query = settingsEntries
		? '?query=' + JSON.stringify({ _id: { $in: settingsEntries } })
		: '';
	return fetchRCData(url + query, FETCH_METHODS.GET);
};
