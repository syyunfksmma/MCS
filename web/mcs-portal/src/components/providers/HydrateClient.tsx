'use client';

import { Hydrate, HydrateProps } from '@tanstack/react-query';

export default function HydrateClient(props: HydrateProps) {
  return <Hydrate {...props} />;
}
