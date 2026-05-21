// ─────────────────────────────────────────────────────────────────────────────
// src/data/resume.ts  — Single source of truth for all portfolio content
// Cross-checked against Mohammed Shaheer Moidin's PDF resume (May 2026)
// ─────────────────────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  logoUrl?: string;
  description: string[];
  /** Material Symbols icon name for each description bullet (parallel array) */
  icons?: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  github?: string;
  technologies: string[];
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
}

export const RESUME_DATA = {
  name: "Mohammed Shaheer Moidin",
  title: "Full Stack Web Developer",
  phone: "+971 584178955",
  about: "Detail-oriented Full Stack Developer with 7+ years of experience designing, developing, and deploying robust web applications. Expert in cloud-native architectures using AWS and GCP, specializing in scalable microservices and high-performance backend systems.",
  email: "shaheermoidin97@gmail.com",
  github: "https://github.com/techno-moidin",
  linkedin: "https://linkedin.com/in/mohammed-shaheer-moidin",
  location: "Dubai, UAE",
  visaStatus: "Employment Visa",
  languages: ["English", "Hindi", "Tamil", "Malayalam", "Kannada"],

  // ── Education ───────────────────────────────────────────────────────────────
  education: {
    degree: "Bachelor of Computer Applications",
    field: "Computer Science",
    institution: "Srinivas Institute of Management Studies",
    location: "Mangalore, India",
    year: "May 2018",
  } as Education,

  // ── Work Experience ─────────────────────────────────────────────────────────
  experience: [
    // 1 ── SoftBuilders ───────────────────────────────────────────────────────
    {
      id: "1",
      role: "Backend Developer",
      company: "SoftBuilders",
      period: "2024 — Present",
      description: [
        "**SoftBuilders Properties (Real Estate Platform):** Architected a high-traffic API using NestJS and MongoDB, implementing advanced Elasticsearch queries for a 40% improvement in property search latency.",
        "**SoftBuilders Properties (Real Estate Platform):** Built a scalable microservices architecture integrating Apache Kafka for real-time inter-service data sync, hosted via Docker/GCP.",
        "**Homnifi (Crypto Mining & Reward Platform):** Developed queue-based token reward distribution modules using BullMQ, Redis caching, and RabbitMQ event message brokers.",
        "**Homnifi (Crypto Mining & Reward Platform):** Orchestrated a high-volume database migration, moving 85M+ legacy records to an optimized GCP schema with zero downtime.",
        "**Quickdropx (Ongoing Dropshipping SaaS):** Engineered payment processing microservices using Stripe Payment Intents, tiered billing engines, and internal QDX utility token wallets.",
      ],
      icons: ["search", "hub", "toll", "database", "payments"],
      technologies: ["NestJS", "MongoDB", "Elasticsearch", "Kafka", "GCP", "Docker", "BullMQ", "Redis", "RabbitMQ", "Stripe"],
    },

    // 2 ── Hashgate Technologies ──────────────────────────────────────────────
    {
      id: "2",
      role: "Full Stack Developer & Team Lead",
      company: "Hashgate Technologies",
      period: "Oct 2021 — 2024",
      description: [
        "Led development of multiple platforms including copodeals.com, bossini.ae, and drhero.ae — delivering responsive UIs with React.js, Redux, Material UI, Next.js, and React Query.",
        "Built REST APIs using Express.js, Node.js, and MongoDB; secured with JWT authentication, crypto encryption, WebSockets (Socket.IO), and rate limiting.",
        "Deployed web applications using AWS (ECS, EC2, EKS, Amplify, Cognito, SES, Route53, S3) and configured Nginx + PM2 for production environments.",
        "Established CI/CD pipelines via Bitbucket, conducted rigorous unit testing with React Jest, and maintained API documentation via Swagger.",
        "Configured Grafana & Prometheus for system monitoring, and coordinated cross-functional Agile sprints via Jira and Confluence.",
      ],
      icons: ["layers", "api", "cloud_done", "rocket_launch", "monitoring"],
      technologies: ["AWS", "React", "Node.js", "MongoDB", "Jest", "Docker"],
    },

    // 3 ── MuxEmail ───────────────────────────────────────────────────────────
    {
      id: "3",
      role: "Full Stack Web Developer",
      company: "MuxEmail",
      period: "Dec 2019 — Jun 2021",
      description: [
        "Engineered core features of muxemail.com — a high-volume email marketing automation SaaS — using React.js, Material UI, Redux, and React Router.",
        "Built REST APIs using Express.js, Node.js, and Mongoose/MongoDB; established email delivery via AWS SES.",
        "Architected payment migration to Stripe Payment Intents, securing SaaS subscriptions through asynchronous webhooks.",
        "Engineered hybrid payment and crypto wallet mechanisms, integrating Stripe with internal token wallets for token swapping.",
        "Built CI/CD pipelines reducing release cycles by 30%, and maintained API documentation via Swagger.",
        "Coordinated team workflows using Trello, Slack, and Scrum poker; conducted code reviews and developed unit tests with React Jest.",
      ],
      icons: ["web", "api", "payments", "wallet", "rocket_launch", "groups"],
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS SES", "Webhooks"],
    },

    // 4 ── Data Queue System ──────────────────────────────────────────────────
    {
      id: "4",
      role: "Junior Web Developer",
      company: "Data Queue System",
      period: "May 2018 — May 2019",
      description: [
        "Developed web applications using PHP (Laravel/CodeIgniter) and MySQL for retail management systems.",
        "Built mapporentals.com focusing on inventory management and booking modules.",
        "Guided students' final year projects, mentoring 25+ batches on web development fundamentals.",
        "Built interfaces with HTML, JavaScript, jQuery, Bootstrap, CSS, and Media Query.",
      ],
      icons: ["code", "web", "school", "integration_instructions"],
      technologies: ["PHP", "MySQL", "JavaScript", "Bootstrap", "HTML/CSS"],
    },
  ] as Experience[],

  // ── Skills ──────────────────────────────────────────────────────────────────
  skills: [
    {
      title: "Frontend Engineering",
      icon: "layers",
      skills: ["React JS", "Next JS", "Material UI", "TypeScript", "Tailwind CSS", "Redux"],
    },
    {
      title: "Core Systems",
      icon: "terminal",
      skills: ["Node JS", "Express JS", "Nest JS", "JWT Auth", "WebSockets", "Webhooks", "Crypto JS"],
    },
    {
      title: "Cloud & DevOps",
      icon: "cloud",
      skills: ["AWS", "GCP", "Docker", "GitHub Actions", "NGINX", "CI/CD", "PM2"],
    },
    {
      title: "Microservices",
      icon: "account_tree",
      skills: ["Kafka", "RabbitMQ", "BullMQ", "Grafana", "Prometheus", "TCP"],
    },
    {
      title: "Database Management",
      icon: "database",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Redis", "Elasticsearch", "Mongoose"],
    },
    {
      title: "Project Management",
      icon: "badge",
      skills: ["Agile", "Scrum", "Jira", "Confluence", "Swagger", "Bitbucket"],
    },
  ] as SkillCategory[],

  // ── Projects ────────────────────────────────────────────────────────────────
  projects: [
    {
      id: "1",
      title: "SoftBuilders Properties",
      description: "Engineered a high-traffic real estate platform with advanced Elasticsearch property search, microservices via Kafka, and containerized GCP deployment achieving 99.9% uptime.",
      technologies: ["NESTJS", "MONGODB", "ELASTICSEARCH"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHnUlFs8_q6iRndewkIQ6DxpbPJHzd35dfTv199urJ9Zfn1j2GS4ydFTyK5KZnCT-OJd157_BVUty5MVLQcpNcUpjVEnw3u0b-9dEs7M8SHfGG8QR1-ZpVXPZKFM4cjz8SoxlmcqDHpiZ-CmUBwRtJglW2ULj2YtJf4LxYvxld4dw-6ppaSNRbNs4aYneJzjuopsztIh3tBvzkc2DuiI0_7vyyZ1Lx3Gp9HbHW3kpqXefdpQGy83gdEbsP4u9UVpIv9NkIORcLuHA",
    },
    {
      id: "2",
      title: "Quickdropx",
      description: "Enterprise dropshipping platform with Stripe Payment Intents, multi-tier billing engine, coupon redemptions, and a hybrid QDX crypto token wallet for partial payments.",
      technologies: ["STRIPE", "NODE.JS", "CRYPTO"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwki-SJd0hAJUm7mUisxmM9f32juccPiYEmWOyEB_5NJQj74ExWRESHG4J8si_cjF9DcpPrCqEjXadM3_4dvYeIK_unh6icIwzAOqCpWy9EiV0_OVSzPmZX6BwS9j3QNFfgpCB8bdNIDbqv0gaxTEmvLPRqv5Pyx92DTnp6IewV66KwnVXzdcIpzrVgF24kr9nNlAU9UgIHSMhglrED4xEy-25hreN4StVLnvSg4xm53Tmz4Ncsrbx4fC0jZ73VcqQj14Ze5buZYY",
    },
    {
      id: "3",
      title: "Homnifi",
      description: "Robust crypto mining reward and token staking platform featuring high-velocity token swaps, event-driven message queue brokers, and an 85M+ transaction database migration.",
      technologies: ["REDIS", "RABBITMQ", "BULLMQ"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwki-SJd0hAJUm7mUisxmM9f32juccPiYEmWOyEB_5NJQj74ExWRESHG4J8si_cjF9DcpPrCqEjXadM3_4dvYeIK_unh6icIwzAOqCpWy9EiV0_OVSzPmZX6BwS9j3QNFfgpCB8bdNIDbqv0gaxTEmvLPRqv5Pyx92DTnp6IewV66KwnVXzdcIpzrVgF24kr9nNlAU9UgIHSMhglrED4xEy-25hreN4StVLnvSg4xm53Tmz4Ncsrbx4fC0jZ73VcqQj14Ze5buZYY",
    },
    {
      id: "4",
      title: "Copodeals",
      description: "Multi-tenant coupon platform with real-time inventory syncing, Redis server-side caching, and AWS cloud infrastructure for scalable enterprise delivery.",
      technologies: ["REACT", "AWS", "REDIS"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZy1VoBqh1qzLQImKj4S5az3n1S1YTUzC3SP4bSlTcCLeU6f9YapWFQNv2FkC1sykPVCPvuZnOYj41VDJHetu4EtW3Q3XJQiUNkmJvifWWyeV8dPZx0hazqGvFDFgrF4UWvzV3xqhvN3ETjH8JxQIBEx0U9TnkX0zgHKteh43sdtwaa5z4YVh6GAn_3sfp6rhuU4Xhcm73RL07FuI-iR0E68atNeOsZhlztd1_Ef2LlVoNBtiF0v-tbSET1qRtabSiSkcD_j-WclU",
    },
    {
      id: "5",
      title: "Bossini.ae",
      description: "Premium retail storefront optimized for performance and conversion, managing large-scale product catalogs and deployments on Google Cloud Platform.",
      technologies: ["SHOPIFY", "LIQUID", "GCP"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyaGOMQQDc_SuIVWIXGJqDuG5-mLsFj9LNSkkPpBQY20PNM648Bzo2sRMcvePJtB_2yVX3UvBOn42eAr1ggEpxfGQt2suWWVvdbRw3UqN7xKR1CZvbRx9iA3OUiyJFdVc7QTQL4XbC3__KbLZbTS5WHb7pMl89Hvt1OOIduNNm08I8Ibzw2qo7qv2GsgusJn4Si9Lvvu6OZ4qRcGnhN7X89rnU2XZjOb6KmIpTB_SzahGr5zt8-ZuBDNykomz9P20CgVTvskYvZcc",
    },
    {
      id: "6",
      title: "DrHero.ae",
      description: "Healthcare management system for appointments and patient records, built with Next.js and Prisma, featuring high-security data encryption and HIPAA-aligned protocols.",
      technologies: ["NEXT.JS", "PRISMA", "VULTR"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlVpNnLXun8N1Nata-GIWrWq6UV3kkQUiNuZbfdKaGbphdytgg8B9BogCJwJpS3mTcCesTsspXFKDAo-ghCD8LrPybB9qSIOACaZ_1cnBK4buJ_8age9LouLnee9LQYLOrZV-_O__g7CxCG6PxzYXhmB_Xp92NH-adXOE8s127XvVTr24HODmlCogOusJjVa1I3dt9jL3tvQNJBzyzHEbVFToF1D0-SGD6i3OaSkulPhyKRshyJ_mUNmXe3z7UtoHDf8kbMXaZIzM",
    },
    {
      id: "7",
      title: "MuxEmail",
      description: "High-volume email marketing automation SaaS leveraging AWS SES, RabbitMQ message brokering, and Docker for high-throughput transactional delivery.",
      technologies: ["RABBITMQ", "DOCKER", "AWS SES"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDICupLcjoK3YFSsBlhwGWRQtqtiz1AHzfZN8AhP0Xuxa_baba726Rhhp2HtSRLIG715UAcibrbD6wMcg8jPaKQ8EiKahOr9UUu8UmbAXNWIo5y0qMtzVT8WserNvfMHpT3o2osIwRDyFYZ46XZxKqMmdufuwO8onTa8bGH5RuGR7dV8TaxEL2zAifRGRq9wEYYY15ohJfLXbvsuKaNRx9O6RfuuzhyjfQgUmKzCmLtBN3HUF9VUiQhLFKmoifINKxOKeBz1W6bxCs",
    },
  ] as Project[],
};
