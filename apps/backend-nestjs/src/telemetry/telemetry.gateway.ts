import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TelemetryMetrics } from 'shared-types';

@WebSocketGateway({
  cors: {
    origin: (requestOrigin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : ['http://localhost:5173', 'http://localhost:3000'];

      const isLocal = !requestOrigin || requestOrigin.startsWith('http://localhost:') || requestOrigin === 'http://localhost';
      const isVercel = requestOrigin?.endsWith('.vercel.app');
      const isConfigured = allowedOrigins.indexOf(requestOrigin) !== -1;

      if (isConfigured || isLocal || isVercel) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS Policy (MSM Labs Protection)'));
      }
    },
    credentials: true,
  },
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeConnectionsCount = 0;
  private currentTraffic = 100; // default requests per second
  private isRedisEnabled = false;
  private workerNodeCount = 1;
  private telemetryInterval: NodeJS.Timeout | null = null;

  // Handle new client connections
  handleConnection(client: Socket) {
    this.activeConnectionsCount++;
    console.log(`🔌 Client connected: ${client.id}. Total active: ${this.activeConnectionsCount}`);
    
    // Send immediate initial state sync
    client.emit('infraState', {
      redisEnabled: this.isRedisEnabled,
      workerNodes: this.workerNodeCount,
      traffic: this.currentTraffic,
    });
    
    this.startStreaming();
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    this.activeConnectionsCount = Math.max(0, this.activeConnectionsCount - 1);
    console.log(`🔌 Client disconnected: ${client.id}. Total active: ${this.activeConnectionsCount}`);
    
    if (this.activeConnectionsCount === 0) {
      this.stopStreaming();
    }
  }

  // 1 ── Traffic Slider Ingress ────────────────────────────────────────────────
  @SubscribeMessage('adjustTraffic')
  handleAdjustTraffic(client: Socket, payload: { traffic: number }) {
    this.currentTraffic = payload.traffic;
    this.broadcastInfraUpdate();
  }

  // 2 ── Caching Middleware Activation ────────────────────────────────────────
  @SubscribeMessage('toggleRedis')
  handleToggleRedis(client: Socket) {
    this.isRedisEnabled = !this.isRedisEnabled;
    this.broadcastInfraUpdate();
  }

  // 3 ── Scale-Out App Nodes ──────────────────────────────────────────────────
  @SubscribeMessage('provisionNode')
  handleProvisionNode(client: Socket) {
    if (this.workerNodeCount < 8) {
      this.workerNodeCount++;
    } else {
      this.workerNodeCount = 1; // loop back for dynamic UX recycling
    }
    this.broadcastInfraUpdate();
  }

  // 4 ── Reset to Baseline ────────────────────────────────────────────────────
  @SubscribeMessage('resetBaseline')
  handleResetBaseline(client: Socket) {
    this.currentTraffic = 100;
    this.isRedisEnabled = false;
    this.workerNodeCount = 1;
    this.broadcastInfraUpdate();
  }

  // 5 ── Reset Nodes ──────────────────────────────────────────────────────────
  @SubscribeMessage('resetNodes')
  handleResetNodes(client: Socket) {
    this.workerNodeCount = 1;
    this.broadcastInfraUpdate();
  }

  private broadcastInfraUpdate() {
    this.server.emit('infraState', {
      redisEnabled: this.isRedisEnabled,
      workerNodes: this.workerNodeCount,
      traffic: this.currentTraffic,
    });
  }

  // Start periodic telemetry metrics stream
  private startStreaming() {
    if (this.telemetryInterval) return;

    this.telemetryInterval = setInterval(() => {
      const metrics = this.generateMetrics();
      this.server.emit('telemetryMetrics', metrics);
    }, 1000);
  }

  private stopStreaming() {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
  }

  // Heavy dynamic logic simulating live traffic spikes and microservices relief
  private generateMetrics(): TelemetryMetrics {
    const trafficScale = this.currentTraffic / 50000; // percent of maximum load (50,000 req/s)

    // CPU load scales with traffic, alleviated by worker node clusters
    const baseCpu = 5 + (trafficScale * 85);
    const cpuAlleviated = baseCpu / this.workerNodeCount;
    const cpuUsage = Math.min(99, Math.max(1, Math.round(cpuAlleviated + (Math.random() * 4 - 2))));

    // Memory usage grows with nodes and traffic
    const baseMemory = 15 + (this.workerNodeCount * 8) + (trafficScale * 20);
    const memoryUsage = Math.min(95, Math.max(5, Math.round(baseMemory + (Math.random() * 2 - 1))));

    // Latency grows exponentially with traffic, drastically slashed by Redis cache hits
    let baseLatency = 10 + Math.pow(trafficScale, 2) * 450;
    if (this.isRedisEnabled) {
      baseLatency = baseLatency * 0.08; // 92% latency reduction with RAM cache
    }
    const apiLatencyMs = Math.round(Math.max(1, baseLatency + (Math.random() * 6 - 3)));

    return {
      cpuUsage,
      memoryUsage,
      apiLatencyMs,
      activeConnections: this.activeConnectionsCount,
    };
  }
}
