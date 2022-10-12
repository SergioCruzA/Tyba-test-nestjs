import { /* Logger, */ Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface paramsI {
  key: string;
  type: string;
  query: string;
  location?: string;
}

@Injectable()
export class GoogleService {
  // private readonly logger = new Logger(GoogleService.name);
  private client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.configService.get('GOOGLE_URL'),
    };

    this.client = axios.create(axiosConfig);
  }

  async getRestaurants({
    city,
    lattitude,
    longitude,
  }: {
    city?: string;
    lattitude?: string;
    longitude?: string;
  }) {
    const params: paramsI = {
      key: this.configService.get('GOOGLE_KEY'),
      type: 'restaurant',
      query: city,
    };
    if (lattitude && longitude) params.location = `${lattitude} ${longitude}`;
    const { data } = await this.client.get('/place/textsearch/json', {
      params,
    });

    return data;
  }
}
