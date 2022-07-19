import { SessionsListWrapper } from '../sessionsList/SessionsListWrapper';
import { SESSION_LIST_TYPES } from '../session/sessionHelpers';
import { SessionView } from '../session/SessionView';
import { WriteEnquiry } from '../enquiry/WriteEnquiry';
import { AskerInfo } from '../askerInfo/AskerInfo';
import { Monitoring } from '../monitoring/Monitoring';
import { Profile } from '../profile/Profile';
import { SessionViewEmpty } from '../session/SessionViewEmpty';
import { CreateGroupChatView } from '../groupChat/CreateChatView';
import { GroupChatInfo } from '../groupChat/GroupChatInfo';
import { Appointments } from '../appointment/Appointments';
import VideoConference from '../videoConference/VideoConference';
import { config } from '../../resources/scripts/config';
import {
	AUTHORITIES,
	ConsultingTypeBasicInterface,
	hasUserAuthority,
	SessionsDataInterface,
	UserDataInterface
} from '../../globalState';
import { Booking } from '../booking/booking';
import { BookingCancelation } from '../booking/bookingCancelation';
import { MyBookings } from '../booking/myBookings';
import { BookingReschedule } from '../booking/bookingReschedule';

const hasVideoCallFeature = (userData, consultingTypes) =>
	userData &&
	hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
	userData.agencies.some(
		(agency) =>
			!!(consultingTypes || []).find(
				(consultingType) =>
					consultingType.id === agency.consultingType &&
					consultingType.isVideoCallAllowed
			)
	);

const hasConsultantAssigned = (
	userData: UserDataInterface,
	consultingTypes: Array<ConsultingTypeBasicInterface>,
	sessionsData: SessionsDataInterface
) => {
	return !!sessionsData?.mySessions?.[0]?.consultant;
};

const isVideoAppointmentsEnabled = (userData, consultingTypes) =>
	config.enableVideoAppointments &&
	hasVideoCallFeature(userData, consultingTypes);

export const RouterConfigUser = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.asker.sessions',
					small: 'navigation.asker.sessions.small'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			},
			{
				condition: hasConsultantAssigned,
				to: '/booking/events',
				icon: 'booking-events',
				titleKeys: {
					large: 'navigation.booking.events'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/write/:sessionId?',
				component: WriteEnquiry
			},
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			}
		],
		appointmentRoutes: [
			{
				path: '/booking',
				component: Booking
			},
			{
				path: '/booking/cancelation',
				component: BookingCancelation
			},
			{
				path: '/booking/reschedule',
				component: BookingReschedule
			},
			{
				path: '/booking/events',
				component: MyBookings
			}
		]
	};
};

export const RouterConfigConsultant = (): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: config.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: 'inbox',
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				condition: isVideoAppointmentsEnabled,
				to: '/termine',
				icon: 'calendar',
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			},
			{
				condition: hasConsultantAssigned,
				to: '/booking/events',
				icon: 'booking-events',
				titleKeys: {
					large: 'navigation.booking.events'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.MY_SESSION,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionPreview/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/createGroupChat/',
				component: CreateGroupChatView
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: isVideoAppointmentsEnabled,
				path: '/termine',
				exact: false,
				component: Appointments
			}
		],
		appointmentRoutes: [
			{
				path: '/booking',
				component: Booking
			},
			{
				path: '/booking/cancelation',
				component: BookingCancelation
			},
			{
				path: '/booking/reschedule',
				component: BookingReschedule
			},
			{
				path: '/booking/events',
				component: MyBookings
			}
		]
	};
};

export const RouterConfigTeamConsultant = (): any => {
	return {
		plainRoutes: [
			{
				condition: hasVideoCallFeature,
				path: config.urls.consultantVideoConference,
				exact: true,
				component: VideoConference
			}
		],
		navigation: [
			{
				to: '/sessions/consultant/sessionPreview',
				icon: 'inbox',
				titleKeys: {
					large: 'navigation.consultant.enquiries'
				}
			},
			{
				to: '/sessions/consultant/sessionView',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.consultant.sessions',
					small: 'navigation.consultant.sessions.small'
				}
			},
			{
				to: '/sessions/consultant/teamSessionView',
				icon: 'speech-bubbles-team',
				titleKeys: {
					large: 'navigation.consultant.teamsessions',
					small: 'navigation.consultant.teamsessions.small'
				}
			},
			{
				condition: isVideoAppointmentsEnabled,
				to: '/termine',
				icon: 'calendar',
				titleKeys: {
					large: 'navigation.appointments'
				}
			},
			{
				condition: hasConsultantAssigned,
				to: '/booking/events',
				icon: 'booking-events',
				titleKeys: {
					large: 'navigation.booking.events'
				}
			},
			{
				to: '/profile',
				icon: 'person',
				titleKeys: {
					large: 'navigation.profile'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.ENQUIRY,
				exact: false
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.MY_SESSION,
				exact: false
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				type: SESSION_LIST_TYPES.TEAMSESSION,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId',
				component: SessionView,
				type: SESSION_LIST_TYPES.ENQUIRY
			},
			{
				path: '/sessions/consultant/sessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.MY_SESSION
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			},
			{
				path: '/sessions/consultant/teamSessionView/',
				component: SessionViewEmpty
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/',
				component: SessionView,
				type: SESSION_LIST_TYPES.TEAMSESSION
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/editGroupChat',
				component: CreateGroupChatView
			}
		],
		userProfileRoutes: [
			{
				path: '/sessions/consultant/sessionPreview/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/sessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile',
				component: AskerInfo
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/userProfile/monitoring',
				component: Monitoring
			},
			{
				path: '/sessions/consultant/teamSessionView/:rcGroupId/:sessionId/groupChatInfo',
				component: GroupChatInfo
			}
		],
		profileRoutes: [
			{
				path: '/profile',
				exact: false,
				component: Profile
			},
			{
				condition: isVideoAppointmentsEnabled,
				path: '/termine',
				exact: false,
				component: Appointments
			}
		],
		appointmentRoutes: [
			{
				path: '/booking',
				component: Booking
			},
			{
				path: '/booking/cancelation',
				component: BookingCancelation
			},
			{
				path: '/booking/reschedule',
				component: BookingReschedule
			},
			{
				path: '/booking/events',
				component: MyBookings
			}
		]
	};
};

export const RouterConfigPeerConsultant = (): any => {
	return RouterConfigConsultant();
};

export const RouterConfigMainConsultant = (): any => {
	let config = RouterConfigTeamConsultant();
	config.navigation[2].titleKeys = {
		large: 'navigation.consultant.peersessions',
		small: 'navigation.consultant.peersessions.small'
	};
	return config;
};

export const RouterConfigAnonymousAsker = (): any => {
	return {
		navigation: [
			{
				to: '/sessions/user/view',
				icon: 'speech-bubbles',
				titleKeys: {
					large: 'navigation.asker.sessions',
					small: 'navigation.asker.sessions.small'
				}
			}
		],
		listRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId?/:sessionId?',
				component: SessionsListWrapper,
				exact: false
			}
		],
		detailRoutes: [
			{
				path: '/sessions/user/view/:rcGroupId/:sessionId',
				component: SessionView
			},
			{
				path: '/sessions/user/view/',
				component: SessionViewEmpty
			},
			{
				path: '/booking/reschedule',
				component: BookingReschedule
			},
			{
				path: '/booking/events',
				component: MyBookings
			}
		]
	};
};
