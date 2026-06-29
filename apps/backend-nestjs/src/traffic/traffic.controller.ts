import { Controller, Post, Get, Body, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TrafficService } from './traffic.service';
import { TrackPayload, TrafficStats } from 'shared-types';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post('track')
  async trackVisit(@Body() payload: TrackPayload, @Req() req: Request): Promise<{ success: boolean }> {
    // Extract IP from x-forwarded-for to support reverse proxies, fallback to remote address
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    
    // Asynchronously trigger trackVisit to prevent blocking the HTTP response
    this.trafficService.trackVisit(payload, ip).catch(err => {
      console.error('Tracking failure:', err.message);
    });

    return { success: true };
  }

  @Post('auth')
  authenticate(@Body('passcode') passcode: string): { success: boolean; token?: string; message?: string } {
    const result = this.trafficService.authenticatePasscode(passcode);
    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }
    return result;
  }

  @Post('verify-gateway')
  verifyGateway(@Body('key') key: string): { success: boolean } {
    const isValid = this.trafficService.verifyGatewayKey(key);
    if (!isValid) {
      throw new UnauthorizedException('Invalid administrative gateway key.');
    }
    return { success: true };
  }

  @Get('stats')
  async getStats(@Req() req: Request): Promise<TrafficStats> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Administrative authentication token required.');
    }
    
    const token = authHeader.substring(7);
    if (!this.trafficService.validateToken(token)) {
      throw new UnauthorizedException('Invalid or expired administrative token.');
    }

    return this.trafficService.getTrafficStats();
  }
}
