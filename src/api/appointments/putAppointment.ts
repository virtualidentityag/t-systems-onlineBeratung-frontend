import { config } from '../../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './../fetchData';
import { AppointmentsDataInterface } from '../../globalState/interfaces/AppointmentsDataInterface';

export const putAppointment = async (
	appointmentId: string,
	data: Partial<AppointmentsDataInterface>
): Promise<any> => {
	const url = config.endpoints.appointmentsServiceBase + '/' + appointmentId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify(data),
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	});
};
