import axios from 'axios';
import envConfig from 'src/config/config';

export class MramProvider {
  async sendSms(number: string, message: string): Promise<any> {
    if (envConfig.NODE_ENV === 'development') {
      console.log(`[Dev] SMS for ${number}: ${message}`);
      return;
    }

    try {
      const response = await axios.post('https://msg.mram.com.bd/smsapi', {
        api_key: envConfig.MRAM_API_KEY,
        senderid: envConfig.MRAM_API_SECRET,
        type: 'text',
        msg: message,
        contacts: number,
        label: 'transactional',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send SMS via MRAM:', error);
      throw new Error('Failed to send SMS');
    }
  }
}
