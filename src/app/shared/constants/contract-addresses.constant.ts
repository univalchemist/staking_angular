import { environment } from '@environment';

export const CotractAddressesTestnet = {
  laceToken: '0xAaF760Fa545c98Af3ff4ED7cc9AB5675B74fb755',
  guaranteedApyStaking: '0x94d9A1f3511dd2440ac4d78fF44fA8F0616DCb39',
  unlimitedStaking: '0x591458bB6950771682037277fBEa8916c7f9Ed4E',
  lpToken: '0x3db62180acedfcd3b130b558a9be1aa5c00f2c43',
  lpStaking: '0x8E7eB99106b6E8c1F883c7872f5d060014A93330',
};

// TODO change configurations whe SC will be deployed
export const CotractAddressesMainnet = {
  laceToken: '0xAaF760Fa545c98Af3ff4ED7cc9AB5675B74fb755',
  guaranteedApyStaking: '0x850f1D6fAbA720948420A8fbaA36a27451dA6273',
  unlimitedStaking: '0xb227DcCB2FC5A67514b37584f47418d1861Ee92C',
  lpToken: '0x3db62180acedfcd3b130b558a9be1aa5c00f2c43',
  lpStaking: '0x4b38096983cABA027D3F5074Bf9343f3e49eFB44',
};

export const ContractAddresses = environment.isMainnet
  ? CotractAddressesMainnet
  : CotractAddressesTestnet;
