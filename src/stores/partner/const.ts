import { TPartner, TPartnerStoreState } from "./types";

export const initialMockPartners: TPartner[] = [
    {
      partner_id: '62cc15de2b57420e82199606f2e86b40',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDFBu7ihKfRsIjq6dEDQDkTqn4LzycaeVwJi-A8kD9EBRvazPeVl5o7enP19JsooIn6KBCFf-gl-JkhWnsJIfsQ1vb7ie0Jz2NOWaM_jCk9v15OTwILMkpv1yMyGNWoQ2mJIxRKZ9pzLAB32lk_5W15IJubeE7TcRxF2w1OrZLPJejDL_6KU3b_74wVpY8yoj2ejsuWIsNNDEYCwSF27MqvL_RjMapch817j9wSP9qmTFL5Sog3s2uXlxVubLske_JWd_TbNqcD8w',
      partner_profile: {
        basic_info: {
          name: 'Bao Quyen',
          dob: '1996-01-01',
          age: 28,
          city_of_birth: 'Da Nang',
          country_of_birth: 'Vietnam',
        },
      },
    },
  ];

  export const defaultPartnerStoreState: TPartnerStoreState = {
    partners: initialMockPartners,
    isLoading: false,
    isInitialized: false,
  };