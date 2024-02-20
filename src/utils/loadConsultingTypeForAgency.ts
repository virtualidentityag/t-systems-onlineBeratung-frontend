import { apiGetConsultingType } from '../api';
import { AgencyDataInterface } from '../globalState';

export const loadConsultingTypeForAgency = async (
	agency: AgencyDataInterface
): Promise<AgencyDataInterface> => ({
	...agency,
	consultingTypeRel: await apiGetConsultingType({
		consultingTypeId: agency?.consultingType
	})
});
