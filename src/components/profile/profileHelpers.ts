import {
	UserDataInterface,
	ConsultingTypeBasicInterface,
	getConsultingType
} from '../../globalState';

export const convertUserDataObjectToArray = (object) => {
	const array = [];
	Object.keys(object).forEach((key) => {
		let test = {
			type: key,
			value:
				object[key] && typeof object[key] === 'object'
					? convertUserDataObjectToArray(object[key])
					: object[key]
		};
		array.push(test);
	});
	return array;
};

export const getAddictiveDrugsTranslatable = (addictiveDrugs) => {
	return addictiveDrugs ? addictiveDrugs.toString().split(',') : null;
};

export const getUserDataTranslateBase = (consultingType: number) => {
	return consultingType === 0 ? 'user.userAddiction' : 'user.userU25';
};

export enum REGISTRATION_STATUS_KEYS {
	REGISTERED = 'REGISTERED',
	UNREGISTERED = 'UNREGISTERED'
}
export const getConsultingTypesForRegistrationStatus = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>,
	registrationStatus: REGISTRATION_STATUS_KEYS
) => {
	return Object.keys(userData.consultingTypes)
		.map((key) => {
			return {
				consultingType: key,
				data: userData.consultingTypes[key]
			};
		})
		.filter((value) => {
			return registrationStatus === REGISTRATION_STATUS_KEYS.REGISTERED
				? value.data.isRegistered
				: consultingTypes.find(
						(cur) => cur.id === parseInt(value.consultingType)
				  )?.isSubsequentRegistrationAllowed &&
						!value.data.isRegistered;
		});
};

export const consultingTypeSelectOptionsSet = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>
) => {
	const unregisteredConsultingTypesData =
		getConsultingTypesForRegistrationStatus(
			userData,
			consultingTypes,
			REGISTRATION_STATUS_KEYS.UNREGISTERED
		);
	return unregisteredConsultingTypesData.map((value) => {
		const id = parseInt(value.consultingType);
		const consultingType = getConsultingType(consultingTypes, id);

		return {
			value: value.consultingType,
			label: consultingType.titles.registrationDropdown
		};
	});
};

export const hasAskerEmailFeatures = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>
): boolean => {
	const registeredConsultingTypes = getConsultingTypesForRegistrationStatus(
		userData,
		consultingTypes,
		REGISTRATION_STATUS_KEYS.REGISTERED
	);

	return registeredConsultingTypes.some(
		(element) =>
			consultingTypes.find(
				(cur) => cur.id === parseInt(element.consultingType)
			)?.isSetEmailAllowed
	);
};

export const isUniqueLanguage = (value, index, self) => {
	return self.indexOf(value) === index;
};
