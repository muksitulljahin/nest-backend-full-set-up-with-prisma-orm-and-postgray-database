import { FrontEncryptToken } from '../../libs/encryption_libs/frontend.encryption';
import envConfig from 'src/config/config';

export const EncryptData = (data: any) => {
  const isEncrypted = envConfig.ENCRYPTED === true;
  return {
    data: isEncrypted ? FrontEncryptToken(JSON.stringify(data)) : data,
    encrypted: isEncrypted,
  };
};
