// Step configuration for splash screen
export interface SplashScreenStepConfig {
  badge: {
    text: string;
    className: string;
  };
  avatar: {
    src: string;
    alt: string;
    size: number;
  };
  heading: {
    main: string;
    highlight: string;
  };
  description: string;
  button: {
    text: string;
  };
}

export const SPLASH_SCREEN_STEP_1_CONFIG: SplashScreenStepConfig = {
  badge: {
    text: "YOUR JOURNEY",
    className: "text-primary font-bold tracking-[0.2em] text-xs uppercase",
  },
  avatar: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1b9Zn38U0dUJdWxI91timHs_gNiBOvxKhAFDUK7e1I7XKgXDX48Z3MbbpvjxxS0PneHkG71lTRByfGM_wC7gAER_oqrvq-X-LPwtI4o2y_JS6PI_CFtzQNqgguvymKpD6oIj9vaVe6TDYh1Ij6qxW7eIbn8OgUthvnF4oLO9Hcmp0NSEONo6v_v7jq2BG2mxSOWs_V6NwuP9Apsqge-ogOUNb1pHIh9ecUFV9ardapK6xJCIpf1Ho1ZNHEGUUancSUWVr6uY4qxAJ",
    alt: "Profile portrait illustration of a calm woman",
    size: 128,
  },
  heading: {
    main: "From Anxious to",
    highlight: "Secure",
  },
  description: "Shift from anxious attachment to a secure, loving bond.",
  button: {
    text: "Continue",
  },
} as const;

export const SPLASH_SCREEN_STEP_2_CONFIG: SplashScreenStepConfig = {
  badge: {
    text: "YOUR JOURNEY",
    className: "text-primary font-bold tracking-[0.2em] text-xs uppercase",
  },
  avatar: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzEVF4owtUoIE3V05gzqeu36gy34pcy7KVoc75Xn7-c4yxDXwdiBJ5Toqp6ETQUB5FF0HrNC1O-1cNGZ3gQbGoFJ7sypcORHz4Au-clOJg2Nd7K-glBkfSi8mGOCjHHz76qQrSmIuNqJcWrUuwvoWHFqcImZaKIbHqQweb2Bx6jeqXjt7uaGkB06rOsAly-A-Fc2_amlgWKmnHAqAEEc_HpkcFPOwcrVyEKvgy-zDgOZE4jaIckNZUbe2ceLU5ZrtD7NpbRmaH-r-E",
    alt: "Profile portrait illustration of a calm woman",
    size: 128,
  },
  heading: {
    main: "From Anxious to",
    highlight: "Secure",
  },
  description: "Help you build solid plan in every stage of your relationship",
  button: {
    text: "Continue",
  },
} as const;
