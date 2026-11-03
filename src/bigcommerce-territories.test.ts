import fs from 'fs';
import path from 'path';

describe('legacy BigCommerce territory fixtures', () => {
  const source = fs.readFileSync(path.resolve(process.cwd(), 'public/js/bigcommerce.js'), 'utf8');

  it.each([
    ['DC', 'District of Columbia'],
    ['AS', 'American Samoa'],
    ['GU', 'Guam'],
    ['MP', 'Northern Mariana Islands'],
    ['PR', 'Puerto Rico'],
    ['VI', 'Virgin Islands'],
  ])('keeps native US subdivision %s in the destination selector', (code, label) => {
    expect(source).toContain(`<option value="${code}">${label}</option>`);
  });

  it('uses the selected subdivision for enabled/disabled ammo rules and US dealer consignments', () => {
    expect(source).toContain('FFLConfigs.statesRequireAmmoFFL.includes(dealerData.stateOrProvinceCode)');
    expect(source).toContain('stateOrProvinceCode: dealerData.stateOrProvinceCode');
    expect(source).toContain('countryCode: dealerData.countryCode');
  });
});
