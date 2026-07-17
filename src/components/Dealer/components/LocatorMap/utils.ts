import formatPhoneNumber from './../../PhoneNumberFormatter';

export const handleSelect = (
  dealer: any,
  selectDealer: any,
  options: { appendFflToCompanyName?: boolean } = {},
) => {
  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });
  const company = options.appendFflToCompanyName
    ? `${dealer.business_name} - ${dealer.license}`
    : dealer.business_name;
  const shippingRecipient =
    dealer.shipping_recipient_first_name && dealer.shipping_recipient_last_name
      ? {
          firstName: dealer.shipping_recipient_first_name,
          lastName: dealer.shipping_recipient_last_name,
        }
      : {};

  selectDealer({
    id: dealer.id,
    phone: formattedDealerPhoneNumber,
    company,
    address1: dealer.premise_street,
    address2: '',
    addressFormatted: `${dealer.business_name} | ${dealer.license}<br/>${formattedDealerPhoneNumber}<br/>${dealer.premise_street}<br/>${dealer.premise_city}, ${dealer.premise_state} ${dealer.premise_zip} / United States`,
    city: dealer.premise_city,
    stateOrProvinceCode: dealer.premise_state,
    shouldSaveAddress: true,
    postalCode: dealer.premise_zip,
    localizedCountry: 'United States',
    countryCode: 'US',
    fflID: dealer.license,
    uuid: dealer.uuid,
    ...shippingRecipient,
  });
};

export const onMarkerClick = (dealer: any, map: any, setState: any) => {
  const formattedDealerPhoneNumber = formatPhoneNumber({ phoneNumber: dealer.phone_number });

  setState({
    activeDealer: dealer,
    activeDealerPhone: dealer.phone_number,
    activeDealerPhoneFormatted: formattedDealerPhoneNumber,
    showingInfoWindow: true,
  });

  map.panTo({ lat: dealer.lat, lng: dealer.lng });
};
