import { PropsWithChildren } from 'react';

export default function ChatLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="max-w-lg mx-auto">{children}</div>;
}
