"use client";

import { PropsWithChildren } from "react";
import FooterLayoutV2 from "./footer-layout-v2";

export default function AssistantLayout(props: Readonly<PropsWithChildren>) {
  const { children } = props;

  return <FooterLayoutV2>{children}</FooterLayoutV2>;
}
