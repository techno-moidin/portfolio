# Senior System Design & Architecture Prep Guide

This guide compiles the **most critical, high-impact technical interview questions** that Tier 1 and Tier 2 engineering teams (Careem, Property Finder, Bybit, G42, etc.) will ask based on your actual resume projects. 

For each question, a structured **"Tier 1 Architect"** response pattern is provided to help you stand out immediately from other applicants.

---

## 🗺️ Master Index of Prep Scenarios
*   [Scenario 1: Zero-Downtime DB Migration (85M+ Records)](#scenario-1-zero-downtime-db-migration-85m-records)
*   [Scenario 2: High-Volume Asynchronous Queue Systems (BullMQ, Redis, RabbitMQ)](#scenario-2-high-volume-asynchronous-queue-systems-bullmq-redis-rabbitmq)
*   [Scenario 3: Stripe Billing & Concurrency Safety (Quickdropx Subscription & Race Conditions)](#scenario-3-stripe-billing--concurrency-safety-quickdropx-subscription--race-conditions)
*   [Scenario 4: MongoDB & Elasticsearch Synchronization (SoftBuilders Properties & Kafka)](#scenario-4-mongodb--elasticsearch-synchronization-softbuilders-properties--kafka)
*   [Scenario 5: Node.js Performance Profiling & Event Loop Bottlenecks](#scenario-5-nodejs-performance-profiling--event-loop-bottlenecks)

---

## Scenario 1: Zero-Downtime DB Migration (85M+ Records)
*Matches Project:* **Homnifi**

### 🎙️ The Interviewer's Question
> *"You migrated 85 million records to a new database schema. How did you design this operation to guarantee data consistency, zero user downtime, and zero data loss under active database load?"*

### 🏛️ The Tier 1 Architect Response
"In high-traffic systems, standard maintenance windows are costly. To run this with **true zero-downtime and zero data loss**, I would implement a **Three-Phase Database Migration Pattern**:"

1.  **Phase 1: Dual-Writing:**
    *   Deploy a minor codebase update where the NestJS application starts writing all **new** inserts and updates to **both** the legacy and the new schemas concurrently. 
    *   *Architectural Benefit:* This ensures that active user activity during the transition is preserved in both schemas, freezing the delta.
2.  **Phase 2: Asynchronous Backfilling:**
    *   Run a background worker script (managed via **BullMQ and Redis**) to stream historical records (created before Phase 1 started) from the old schema to the new schema.
    *   The data is migrated in small, controlled batches (e.g., 5,000 records at a time) to prevent memory saturation (Node.js heap OOM errors) and database lockups.
3.  **Phase 3: Reconciliation and Cutover:**
    *   Run an asynchronous auditing script to compare counts, hashes, and document shapes between both schemas.
    *   Once 100% integrity is verified, flip the application's **Read API** queries to read from the new schema. 
    *   After 24-48 hours of successful monitoring, deprecate the write paths to the legacy database.

---

## Scenario 2: High-Volume Asynchronous Queue Systems (BullMQ, Redis, RabbitMQ)
*Matches Project:* **Homnifi Crypto Mining Platform**

### 🎙️ The Interviewer's Question
> *"You built a queue-based token reward distribution system using BullMQ, Redis, and RabbitMQ. How did you design this system to handle high throughput while preventing double payouts (over-crediting tokens) if a worker crashed mid-processing?"*

### 🏛️ The Tier 1 Architect Response
"Processing payouts demands absolute consistency. I designed the system around two fundamental pillars: **Idempotent Consumer Patterns** and **Transactional Outbox Processing**:"

1.  **Ensuring Idempotency (Preventing Double Payouts):**
    *   Every transaction or reward payout is assigned a unique, deterministic ID (e.g., `reward_userId_date`).
    *   Before a worker credits a user, it uses a **Redis Distributed Lock (using `NX` key set)** or checks a unique database constraint on the target transaction collection. 
    *   If the transaction ID already exists, the worker immediately discards the message (ignoring duplicate delivery).
2.  **Robust Error & Crash Recovery:**
    *   **Dead Letter Exchanges (DLX) in RabbitMQ:** If a worker encounters an unrecoverable system error (e.g., external API timeout), the message is routed to a Dead Letter Queue (DLQ) with exponential backoff rather than failing silently.
    *   **BullMQ Retries:** For transient errors (e.g., database connection timeout), BullMQ is configured to retry the job using an exponential retry limit (e.g., 3 retries, doubling backoff time).
    *   **Manual Acknowledgment (`ack`):** Workers only acknowledge messages to RabbitMQ/BullMQ *after* the database write succeeds. If the server crashes mid-process, the message is automatically returned to the queue (`nack`) and picked up by another live worker.

---

## Scenario 3: Stripe Billing & Concurrency Safety (Quickdropx Subscription & Race Conditions)
*Matches Project:* **Quickdropx Dropshipping SaaS**

### 🎙️ The Interviewer's Question
> *"You designed the subscription billing system for a multi-tenant SaaS. How did you handle webhook reliability from Stripe, and how did you patch the race condition where concurrent requests could exploit team seat allocations?"*

### 🏛️ The Tier 1 Architect Response
"Subscription engines must be highly secure and bulletproof. I approached these challenges with **asynchronous event pipelines** and **database transaction isolation**:"

1.  **Securing Stripe Webhook Processing:**
    *   To prevent webhooks from timing out or failing due to Stripe's strict timeout limits, the webhook endpoint acts as an **Ingestor**. It does not perform heavy database updates inline.
    *   Instead, the endpoint validates the Stripe signature, immediately returns a `200 OK` to Stripe, and publishes the event to a background queue (RabbitMQ/BullMQ) to process it asynchronously.
2.  **Patching the Team Seat Limit Race Condition:**
    *   *The Vulnerability:* Concurrent API requests (Check-Then-Act) occurred when a team owner sent multiple fast, simultaneous requests to invite members, checking the seat limit before database writes were committed.
    *   *The Architectural Patch:* I wrapped the invite action inside a **Database Transaction with Pessimistic Locking** (e.g., `SELECT ... FOR UPDATE` in PostgreSQL or using a **Redis Lock** keyed to `lock:team:id` with a 3-second timeout). This forces concurrent requests to serialize, ensuring only one invite is processed at a time.

---

## Scenario 4: MongoDB & Elasticsearch Synchronization (SoftBuilders Properties & Kafka)
*Matches Project:* **SoftBuilders Properties (Real Estate Platform)**

### 🎙️ The Interviewer's Question
> *"You built a real estate portal using NestJS, MongoDB, Elasticsearch, and Kafka. How did you ensure that property updates in MongoDB were synchronized to Elasticsearch in real-time, and how did you handle sync failures if Kafka crashed?"*

### 🏛️ The Tier 1 Architect Response
"Synchronizing two distinct database systems requires careful consistency management. I designed a **Change Data Capture (CDC) pipeline** using the **Transactional Outbox Pattern**:"

1.  **Real-time Synchronization Architecture:**
    *   When an agent updates a property, the application commits the write to **MongoDB** and writes an index event into an `outbox` collection in the same database transaction.
    *   A publisher service watches MongoDB's **Change Streams** or polls the outbox, publishing the event to a **Kafka Topic** (e.g., `property-updates`).
    *   An Elasticsearch indexing consumer service reads from the Kafka topic and indexes the updated property immediately.
2.  **Handling Message Broker Outages (Kafka Crash):**
    *   Because Kafka keeps an immutable offset log, if the index consumer crashes or Kafka goes offline, the consumer will resume exactly where it left off once the connection is restored, ensuring **eventual consistency**.
    *   If MongoDB writes succeed but publishing fails, we run a daily **Reconciliation Sync Script** (a cron job) that compares MongoDB's `updatedAt` records with Elasticsearch's index state, correcting any rare missing items.

---

## Scenario 5: Node.js Performance Profiling & Event Loop Bottlenecks
*Matches Experience:* **Hashgate Technologies / Team Lead**

### 🎙️ The Interviewer's Question
> *"In NestJS/Node.js backend microservices under heavy concurrent load, how do you locate and resolve CPU bottlenecks or memory leaks? What profiling tools have you used in production?"*

### 🏛️ The Tier 1 Architect Response
"Node.js runs on a single-threaded event loop, which means CPU-bound work can easily block all incoming I/O requests. I systematically isolate bottlenecks using **profiling, metric instrumentation, and architectural offloading**:"

1.  **Finding CPU-Bound Bottlenecks:**
    *   If API latency spikes under load, I look for **event loop blockages**. These are typically caused by heavy JSON parsing, large array manipulations, or CPU-intensive crypto operations.
    *   In production, I instrument the codebase using **Prometheus and Grafana** to track the Node.js event loop delay metric (`event_loop_delay_ms`).
    *   To locate the exact file/function, I run Node.js with the `--inspect` flag and connect **Chrome DevTools** to capture a CPU Profile, identifying "heavy" functions taking too much execution time.
2.  **Finding Memory Leaks:**
    *   If memory usage continuously increases over time until the server crashes, I capture **Heap Snapshots** at 15-minute intervals using Node's standard inspect interface.
    *   I compare the snapshots in Chrome DevTools to locate which object types (e.g., orphaned database sockets, global cache arrays, unclosed event listeners) are growing in count without being garbage collected.
3.  **Resolution Patterns:**
    *   **CPU offloading:** Move heavy JSON transformations or file imports into separate **Worker Threads** or offload them to background microservice queues.
    *   **Database optimization:** Replace unoptimized `find()` loops with unified database aggregation queries (e.g., using MongoDB Aggregation pipelines) to leverage database-level indexing.
