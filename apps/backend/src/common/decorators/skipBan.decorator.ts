import { SetMetadata } from '@nestjs/common';

export const SKIP_BAN = 'skipBan';
export const SkipBan = () => SetMetadata(SKIP_BAN, true);
