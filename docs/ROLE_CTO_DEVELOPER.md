# View Specification: CTO & Senior Developer Interactive Sandbox

## 1. Technical Layout State
When flipped, the UI activates developer decorations: showing endpoint labels next to data fields, logging front-to-back lifecycle hooks to a custom on-screen console, and detailing system performance.

## 2. Interactive Feature 1: The Code Review Simulator
- **UI Architecture:** A split panel rendering an editor interface mimicking a real IDE environment.
- **The Puzzle Logic:** Display a 20-line snippet containing an asynchronous race condition or an unoptimized database N+1 loop.
- **Interaction:** User clicks on the faulty lines. 
- **Backend Flow:** `POST /api/sandbox/verify-bug` validation. On correct identification, render an interactive diff panel showing how your production-level code fixes the leak cleanly.

## 3. Interactive Feature 2: System Architecture Stress-Tester
- **UI Architecture:** A visual node map displaying [Frontend] -> [Load Balancer] -> [NestJS App Clusters] -> [Redis Cache] -> [PostgreSQL].
- **Interaction:** A slider allowing users to crank traffic from 10 req/sec up to 50,000 req/sec.
- **Real-Time Data Layer:** 
  - Connect via WebSockets (`ws://localhost:3000/telemetry`).
  - As traffic scales, NestJS pipes fluctuating synthetic performance arrays (CPU spikes, latency variations).
  - Toggle buttons for "Enable Redis Caching" or "Spin Up Worker Node" immediately adjust the incoming payload values, dropping database strain animations back to zero.