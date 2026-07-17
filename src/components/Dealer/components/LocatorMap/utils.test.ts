import { handleSelect } from './utils';

const dealerFixture = () => ({
  id: 1,
  business_name: 'ACME Guns',
  license: '1-23-456',
  phone_number: '5555551234',
  premise_street: '100 Main St',
  premise_city: 'Lexington',
  premise_state: 'KY',
  premise_zip: '40507',
  uuid: 'abc-123',
});

describe('handleSelect - company field', () => {
  it('emits raw business_name as company by default', () => {
    const selectDealer = jest.fn();

    handleSelect(dealerFixture(), selectDealer);

    expect(selectDealer).toHaveBeenCalledTimes(1);
    expect(selectDealer.mock.calls[0][0].company).toBe('ACME Guns');
  });

  it('emits raw business_name when appendFflToCompanyName is false', () => {
    const selectDealer = jest.fn();

    handleSelect(dealerFixture(), selectDealer, { appendFflToCompanyName: false });

    expect(selectDealer.mock.calls[0][0].company).toBe('ACME Guns');
  });

  it('appends the FFL license when appendFflToCompanyName is true', () => {
    const selectDealer = jest.fn();

    handleSelect(dealerFixture(), selectDealer, { appendFflToCompanyName: true });

    expect(selectDealer.mock.calls[0][0].company).toBe('ACME Guns - 1-23-456');
  });

  it('does not change addressFormatted (license is already there)', () => {
    const selectDealer = jest.fn();

    handleSelect(dealerFixture(), selectDealer, { appendFflToCompanyName: true });

    const payload = selectDealer.mock.calls[0][0];
    expect(payload.addressFormatted).toContain('ACME Guns | 1-23-456');
  });

  it('passes through the AutoFFL-resolved shipping recipient', () => {
    const selectDealer = jest.fn();
    const dealer = {
      ...dealerFixture(),
      shipping_recipient_first_name: 'FFL',
      shipping_recipient_last_name: 'Receiving',
    };

    handleSelect(dealer, selectDealer);

    expect(selectDealer.mock.calls[0][0]).toMatchObject({
      firstName: 'FFL',
      lastName: 'Receiving',
    });
  });

  it('does not invent shipping recipient names when AutoFFL omits them', () => {
    const selectDealer = jest.fn();

    handleSelect(dealerFixture(), selectDealer);

    const payload = selectDealer.mock.calls[0][0];
    expect(payload).not.toHaveProperty('firstName');
    expect(payload).not.toHaveProperty('lastName');
  });
});
