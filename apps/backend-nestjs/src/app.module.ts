import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio/portfolio.controller';
import { SandboxController } from './sandbox/sandbox.controller';
import { TelemetryGateway } from './telemetry/telemetry.gateway';
import { TrafficModule } from './traffic/traffic.module';

@Module({
  imports: [TrafficModule],
  controllers: [PortfolioController, SandboxController],
  providers: [TelemetryGateway],
})
export class AppModule {}
