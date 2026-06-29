import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { TrackPayload, VisitorRecord, TrafficStats } from 'shared-types';
import { VisitorSchema } from './traffic.schema';

@Injectable()
export class TrafficService implements OnModuleInit, OnModuleDestroy {
  private useMongo = false;
  private connection: mongoose.Connection = null;
  private visitorModel: mongoose.Model<any> = null;
  private readonly localDbPath = path.join(__dirname, '..', '..', 'traffic_local.json');
  private activeTokens = new Set<string>();

  async onModuleInit() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        console.log('Connecting to MongoDB Atlas for traffic tracking...');
        const connection = await mongoose.createConnection(mongoUri).asPromise();
        this.connection = connection;
        this.visitorModel = connection.model('Visitor', VisitorSchema);
        this.useMongo = true;
        console.log('🟢 MongoDB Atlas Traffic Tracking Connected.');
      } catch (err) {
        console.error('🔴 MongoDB Atlas Connection failed. Falling back to local JSON database.', err.message);
        this.useMongo = false;
      }
    } else {
      console.log('ℹ️ No MONGODB_URI found. Using local JSON database fallback.');
    }

    // Ensure local DB file exists if mongo is not active
    if (!this.useMongo) {
      const dir = path.dirname(this.localDbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.localDbPath)) {
        fs.writeFileSync(this.localDbPath, JSON.stringify([], null, 2));
      }
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log('Cleaned up MongoDB traffic tracking connection.');
    }
  }

  // Geolocation lookup logic
  private async getGeoDetails(ipAddress: string) {
    const cleanIp = ipAddress.split(',')[0].trim();
    
    // Check for loopbacks or local IPs
    const isLocal = cleanIp === '127.0.0.1' || 
                    cleanIp === '::1' || 
                    cleanIp.startsWith('fe80:') || 
                    cleanIp.startsWith('::ffff:127.0.0.1') ||
                    cleanIp === 'localhost';

    if (isLocal) {
      return {
        country: 'Local Network',
        region: 'Dubai',
        city: 'UAE',
        isp: 'Localhost Loopback',
      };
    }

    try {
      // Use ip-api.com (free, no API key required for low-frequency lookup)
      const response = await fetch(`http://ip-api.com/json/${cleanIp}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.status === 'success') {
          return {
            country: data.country || 'Unknown Country',
            region: data.regionName || 'Unknown Region',
            city: data.city || 'Unknown City',
            isp: data.isp || 'Unknown ISP',
          };
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch geo IP metadata for ${cleanIp}:`, err.message);
    }

    return {
      country: 'Unknown Country',
      region: 'Unknown Region',
      city: 'Unknown City',
      isp: 'Unknown Network',
    };
  }

  // 1 ── Track Visitor Visit ──────────────────────────────────────────────────
  async trackVisit(payload: TrackPayload, rawIp: string): Promise<void> {
    const { deviceId, userAgent } = payload;
    const ip = rawIp || 'Unknown IP';
    const geo = await this.getGeoDetails(ip);

    if (this.useMongo && this.visitorModel) {
      try {
        const now = new Date();
        const existing = await this.visitorModel.findOne({ deviceId });

        if (existing) {
          existing.visitCount += 1;
          existing.lastVisit = now;
          existing.ip = ip;
          existing.userAgent = userAgent;
          // Refresh geo in case they moved
          existing.country = geo.country;
          existing.region = geo.region;
          existing.city = geo.city;
          existing.isp = geo.isp;
          await existing.save();
        } else {
          await this.visitorModel.create({
            deviceId,
            ip,
            userAgent,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            isp: geo.isp,
            visitCount: 1,
            firstVisit: now,
            lastVisit: now,
          });
        }
      } catch (err) {
        console.error('Failed to log tracking event in MongoDB:', err.message);
        // Fall back to local file if MongoDB save fails dynamically
        await this.trackVisitLocal(deviceId, ip, userAgent, geo);
      }
    } else {
      await this.trackVisitLocal(deviceId, ip, userAgent, geo);
    }
  }

  private async trackVisitLocal(deviceId: string, ip: string, userAgent: string, geo: any): Promise<void> {
    try {
      const dataStr = fs.readFileSync(this.localDbPath, 'utf8');
      const visitors: VisitorRecord[] = JSON.parse(dataStr);
      const nowStr = new Date().toISOString();

      const existingIndex = visitors.findIndex(v => v.deviceId === deviceId);
      if (existingIndex > -1) {
        const existing = visitors[existingIndex];
        existing.visitCount += 1;
        existing.lastVisit = nowStr;
        existing.ip = ip;
        existing.userAgent = userAgent;
        existing.country = geo.country;
        existing.region = geo.region;
        existing.city = geo.city;
        existing.isp = geo.isp;
        visitors[existingIndex] = existing;
      } else {
        visitors.push({
          deviceId,
          ip,
          userAgent,
          country: geo.country,
          region: geo.region,
          city: geo.city,
          isp: geo.isp,
          visitCount: 1,
          firstVisit: nowStr,
          lastVisit: nowStr,
        });
      }

      fs.writeFileSync(this.localDbPath, JSON.stringify(visitors, null, 2));
    } catch (err) {
      console.error('Failed to save tracking event to local JSON:', err.message);
    }
  }

  // 2 ── Retrieve Aggregated Stats ───────────────────────────────────────────
  async getTrafficStats(): Promise<TrafficStats> {
    let rawVisitors: any[] = [];

    if (this.useMongo && this.visitorModel) {
      try {
        rawVisitors = await this.visitorModel.find().sort({ lastVisit: -1 }).exec();
      } catch (err) {
        console.error('Failed to fetch stats from MongoDB, reading local:', err.message);
        rawVisitors = this.getTrafficStatsLocal();
      }
    } else {
      rawVisitors = this.getTrafficStatsLocal();
    }

    const visitors: VisitorRecord[] = rawVisitors.map(v => ({
      deviceId: v.deviceId,
      ip: v.ip || 'Unknown IP',
      userAgent: v.userAgent || 'Unknown UA',
      country: v.country || 'Unknown Country',
      region: v.region || 'Unknown Region',
      city: v.city || 'Unknown City',
      isp: v.isp || 'Unknown ISP',
      visitCount: v.visitCount,
      firstVisit: new Date(v.firstVisit).toISOString(),
      lastVisit: new Date(v.lastVisit).toISOString(),
    }));

    let totalViews = 0;
    let uniqueViewers = visitors.length;
    let returningViewers = 0;

    visitors.forEach(v => {
      totalViews += v.visitCount;
      if (v.visitCount > 1) {
        returningViewers += 1;
      }
    });

    return {
      totalViews,
      uniqueViewers,
      returningViewers,
      visitors,
    };
  }

  private getTrafficStatsLocal(): VisitorRecord[] {
    try {
      if (fs.existsSync(this.localDbPath)) {
        const dataStr = fs.readFileSync(this.localDbPath, 'utf8');
        return JSON.parse(dataStr);
      }
    } catch (err) {
      console.error('Failed to read local stats:', err.message);
    }
    return [];
  }

  // 3 ── Passcode Authorization ───────────────────────────────────────────────
  authenticatePasscode(passcode: string): { success: boolean; token?: string; message?: string } {
    const targetPasscode = process.env.ADMIN_PASSCODE || 'msmlabs26';
    if (passcode === targetPasscode) {
      const token = 'msm-admin-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
      this.activeTokens.add(token);
      
      // Prevent memory growth by capping tokens set
      if (this.activeTokens.size > 50) {
        const firstToken = this.activeTokens.values().next().value;
        if (firstToken) this.activeTokens.delete(firstToken);
      }
      
      return { success: true, token };
    }
    return { success: false, message: 'Invalid administrative passcode.' };
  }

  validateToken(token: string): boolean {
    return this.activeTokens.has(token);
  }

  verifyGatewayKey(key: string): boolean {
    const targetKey = process.env.ADMIN_GATEWAY_KEY || 'msmlabs26';
    return key === targetKey;
  }
}

