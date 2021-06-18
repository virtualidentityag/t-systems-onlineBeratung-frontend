import { RENEW_BEFORE_EXPIRY_IN_MS } from '../../src/components/auth/auth';
import { getTokenExpiryFromLocalStorage } from '../../src/components/sessionCookie/accessSessionLocalStorage';
import { config } from '../../src/resources/scripts/config';

const waitForTokenProcessing = () => {
	// TODO: don't arbitrarily wait for token to be processed, find some
	// way to cleanly determine that the token was processed instead.
	// possible candidates are spying on `localStorage` or `setTimeout`
	return cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
};

describe('Keycloak Tokens', () => {
	let authTokenJson;
	beforeEach(() => {
		cy.fixture('auth.token.json').then((fixture) => {
			authTokenJson = fixture;
		});

		cy.fixture('service.consultingtypes.addiction.json').then(
			(addictionConsultingType) => {
				cy.fixture(
					'service.consultingtypes.u25.json'
				).then((u25ConsultingType) =>
					cy.intercept(
						`${config.endpoints.consultingTypeServiceBase}/basic`,
						[addictionConsultingType, u25ConsultingType]
					)
				);
			}
		);
	});

	it('should get and store tokens and expiry time on login', () => {
		cy.caritasMockedLogin();

		cy.get('#appRoot').then(() => {
			cy.getCookie('keycloak').should('exist');
			cy.getCookie('refreshToken').should('exist');

			const tokenExpiry = getTokenExpiryFromLocalStorage();
			expect(tokenExpiry.accessTokenValidUntilTime).to.exist;
			expect(tokenExpiry.refreshTokenValidUntilTime).to.exist;
		});
	});

	it('should keep refreshing access token before it expires', () => {
		cy.clock();
		cy.caritasMockedLogin();

		for (let check = 0; check < 3; check++) {
			waitForTokenProcessing();

			cy.tick(
				authTokenJson.expires_in * 1000 - RENEW_BEFORE_EXPIRY_IN_MS
			);
			cy.wait('@authToken').then((interception) => {
				expect(interception.request.body).to.include(
					'grant_type=refresh_token'
				);
			});
		}
	});

	it('should refresh the access token if its expired when loading the app', () => {
		cy.intercept(
			`${config.endpoints.consultingTypeServiceBase}/byslug/sessions/full`,
			{ statusCode: 404 }
		);

		cy.clock();
		cy.caritasMockedLogin();

		cy.clock().then((clock) => {
			clock.restore();
		});
		cy.clock(authTokenJson.expires_in * 1000 + 1);
		cy.reload();
		cy.get('#appRoot');

		cy.wait('@authToken').then((interception) => {
			expect(interception.request.body).to.include(
				'grant_type=refresh_token'
			);
		});

		cy.tick(1000); // logout() call uses setTimeout
		cy.get('#appRoot').should('exist');
	});

	it.skip('should logout if refresh token is already expired when loading the app', () => {
		cy.clock();
		cy.caritasMockedLogin();

		cy.clock().then((clock) => {
			clock.restore();
		});
		cy.clock(authTokenJson.refresh_expires_in * 1000 + 1);
		cy.reload();
		cy.get('#appRoot');
		waitForTokenProcessing();

		cy.tick(1000); // logout() call uses setTimeout
		cy.get('#loginRoot').should('exist');
	});

	it('should logout if refresh token is expired while the app is loaded', () => {
		cy.clock();
		cy.caritasMockedLogin();
		waitForTokenProcessing();

		cy.tick(authTokenJson.refresh_expires_in * 1000 + 1);
		waitForTokenProcessing();

		cy.tick(1000); // logout() call uses setTimeout
		cy.get('#loginRoot').should('exist');
	});

	it('should not logout if refresh token is expired but access token is still valid', () => {
		cy.clock();
		cy.caritasMockedLogin({
			auth: { expires_in: 1800, refresh_expires_in: 600 }
		});

		waitForTokenProcessing();
		cy.tick(600 * 1000);
		waitForTokenProcessing();

		cy.tick(1000); // logout() call uses setTimeout
		cy.get('#loginRoot').should('not.exist');
	});

	it('should not logout if refresh token is expired but access token is still valid when the app loads', () => {
		const refreshExpiresIn = 600;

		cy.clock();
		cy.caritasMockedLogin({
			auth: { expires_in: 1800, refresh_expires_in: refreshExpiresIn }
		});

		cy.clock().then((clock) => {
			clock.restore();
		});
		cy.clock(refreshExpiresIn * 1000 + 1);
		cy.reload();
		cy.get('#appRoot');
		waitForTokenProcessing();

		cy.tick(1000); // logout() call uses setTimeout
		cy.get('#loginRoot').should('not.exist');
	});
});
