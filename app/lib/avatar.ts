export const buildAvatarUrl = (seed: string) =>
  `https://avatars.dicebear.com/api/initials/${encodeURIComponent(seed)}.svg?size=96&background=%23e7f5ff&color=%230c4a6e`;
