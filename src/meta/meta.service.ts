import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MetaService {
  constructor(private configService: ConfigService) {}

  async getLeadDetails(leadId: string) {
    const token = this.configService.get<string>('META_ACCESS_TOKEN');

    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${leadId}`,
      {
        params: {
          access_token: token,
        },
      },
    );

    return response.data;
  }
}