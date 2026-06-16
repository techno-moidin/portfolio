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
  phone: "+972 524178995",
  about: "Detail-oriented Full Stack Developer with 7+ years of experience designing, developing, and deploying robust web applications. Expert in cloud-native architectures using AWS and GCP, specializing in scalable microservices and high-performance backend systems.",
  email: "shaheermoidin97@gmail.com",
  github: "",
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
        "**Homnifi-CloudK Feature Team:** Led the feature team in designing and implementing efficient microservices communication architecture [1]. Contributed to a platform where users can purchase mining machines, generate token rewards, and swap/stake tokens for additional earnings [2].",
        "**Homnifi (Crypto Mining & Reward Platform):** Built and optimized queue-based reward generation using BullMQ for retry mechanisms, Redis caching, and RabbitMQ event-driven architecture on separate GCP VM instances [2].",
        "**Homnifi:** Developed email and Telegram-based reporting systems for daily performance analysis and configured Grafana and Prometheus for real-time monitoring [2].",
        "**Homnifi:** Led a high-volume database migration, transferring 85+ million legacy records to a new structure with optimized scripts [2].",
        "**SoftBuilders Properties (Real Estate Platform):** Developed a platform allowing users to search properties based on area, city, popularity, and price [3]. Built the backend API using NestJS, MongoDB, and Elasticsearch to ensure efficient property searches [3].",
        "**SoftBuilders Properties:** Designed the application using a microservices architecture, integrating Kafka as the message broker, and deployed it on GCP with NGINX as a reverse proxy [3].",
        "**Quickdropx (Ongoing Dropshipping SaaS):** Built a multi-tenant SaaS platform combining dropshipping automation (import & resell products across eBay, Shopify, Amazon via supplier integrations) with a native marketplace where sellers manage inventory and buyers checkout [4].",
        "**Quickdropx:** Built the full Stripe subscription system including payment intents, plan upgrades, trial periods, coupon handling, webhooks, and designed mid-cycle subscription proration with Claude [4].",
        "**Quickdropx:** Owned the add-on module end-to-end, covering the purchase flow, auto-renewal, invoice generation, and payment history [4].",
        "**Quickdropx:** Enforced permission-based access across team members, including store-level scoping, privilege mapping, and seat limit enforcement [4].",
        "**Quickdropx:** Built a marketplace promotion system with atomic slot claiming to prevent overselling, and shipped a third-party product import pipeline with per-row error reporting and duplicate prevention [4].",
        "**Quickdropx:** Fixed a race condition that let concurrent requests exceed team seat limits, and patched a cross-tenant write vulnerability in the product import pipeline [4].",
      ],
      icons: [
        "groups",
        "toll",
        "monitoring",
        "database",
        "search",
        "hub",
        "store",
        "payments",
        "extension",
        "shield",
        "receipt",
        "security",
      ],
      technologies: [
        "NestJS",
        "MongoDB",
        "Elasticsearch",
        "Kafka",
        "GCP",
        "Docker",
        "BullMQ",
        "Redis",
        "RabbitMQ",
        "Stripe",
      ],
    },

    // 2 ── Hashgate Technologies ──────────────────────────────────────────────
    {
      id: "2",
      role: "Full Stack Developer / Team Lead",
      company: "Hashgate Technologies",
      period: "2021 — 2024",
      description: [
        "**Team Leadership:** Led the Hashgate Team, coordinating with project managers and clients to define tasks, and managed Agile development using Scrum methodology via Jira [1].",
        "**Frontend Architecture:** Developed UIs using React.js, Material UI, Redux, React Router, and Next.js [5]. Implemented React Query for data fetching and utilized React Hooks (useState, useEffect, useContext) for state and context management [5].",
        "**Backend Systems:** Built REST APIs using Express.js, Node.js, and Mongoose [5]. Optimized API performance using MongoDB Profiler and complex queries via MongoDB Aggregation [5].",
        "**Security & Real-time Data:** Secured applications with JWT authentication, Crypto encryption, and Rate Limiting for API protection. Implemented WebSockets (Socket.IO) for real-time updates [5].",
        "**Cloud & DevOps (AWS):** Deployed web applications using extensive AWS services including Elastic Beanstalk, ECS, EC2, Amplify, EKS, Cognito, Secrets Manager, Cloud Map, SES, Route53, S3, and EC2 Snapshots [6].",
        "**Infrastructure Management:** Configured Nginx for reverse proxy and PM2 for process management [6]. Set up CI/CD pipelines via Bitbucket and implemented Grafana & Prometheus for logging and monitoring [1, 6].",
      ],
      icons: [
        "groups",
        "code",
        "api",
        "security",
        "cloud",
        "rocket_launch",
      ],
      technologies: [
        "React.js",
        "Next.js",
        "Node.js",
        "AWS (ECS/EKS/Cognito/S3)",
        "Socket.IO",
        "MongoDB",
        "Grafana",
        "Prometheus",
      ],
    },

    // 3 ── MuxEmail ───────────────────────────────────────────────────────────
    {
      id: "3",
      role: "Full Stack Web Developer",
      company: "MuxEmail",
      period: "2019 — 2021",
      description: [
        "**Core Development:** Engineered frontend architectures using React.js, Material UI, Redux & React Router, paired with backend REST APIs built in Express, Node.js, and MongoDB [7].",
        "**Team Coordination:** Managed task estimation and organized development cycles utilizing Trello, Slack, and scrum poker [7].",
        "**Testing & QA:** Developed comprehensive unit test cases using React Jest, and designed testing protocols to locate system issues prior to production [7].",
        "**Deployment & Monitoring:** Oversaw automated build and deployment pipelines via Bitbucket [7]. Improved and designed monitoring systems to address stability and data quality, and maintained API documentation using Swagger [7].",
      ],
      icons: [
        "code",
        "groups",
        "bug_report",
        "rocket_launch",
      ],
      technologies: [
        "React.js",
        "Node.js",
        "Jest",
        "Swagger",
        "Bitbucket",
        "MongoDB",
      ],
    },

    // 4 ── Data Queue System ──────────────────────────────────────────────────
    {
      id: "4",
      role: "Developer / Student Guide",
      company: "Data Queue System / Q Academia",
      period: "2018 — 2019",
      description: [
        "**Mentorship & Development:** Worked as a guide for 25 student batches completing their final year projects, meeting strict project deadlines without sacrificing build quality [8].",
        "**Core Web Technologies:** Developed applications using a foundational stack consisting of HTML, PHP, MySQL, JavaScript, Bootstrap, CSS, and Media Queries [8].",
      ],
      icons: [
        "school",
        "code",
      ],
      technologies: [
        "PHP",
        "MySQL",
        "JavaScript",
        "Bootstrap",
        "CSS",
      ],
    },
  ] as Experience[],

  // ── Skills ──────────────────────────────────────────────────────────────────
  skills: [
    {
      title: "Frontend Engineering",
      icon: "layers",
      skills: ["React JS", "Next JS", "Material UI", "TypeScript", "Tailwind CSS", "Redux", "Shopify / Liquid"],
    },
    {
      title: "Core Systems",
      icon: "terminal",
      skills: ["Node JS", "Express JS", "Nest JS", "JWT Auth", "WebSockets", "Webhooks", "Crypto JS"],
    },
    {
      title: "Cloud & DevOps",
      icon: "cloud",
      skills: ["AWS", "GCP", "Docker", "CI/CD Automation", "NGINX", "CI/CD", "PM2", "Shell Scripting"],
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
      description: "QuickDropX is a multi-tenant SaaS platform that combines dropshipping automation (import & resell products across eBay, Shopify, Amazon via supplier integrations) with a native marketplace where sellers can list their own products, manage inventory and shipping, and buyers can browse, cart, and checkout.",
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
      title: "Bossini",
      description: "Premium retail storefront optimized for performance and conversion, managing large-scale product catalogs and deployments on Google Cloud Platform.",
      technologies: ["SHOPIFY", "LIQUID", "GCP"],
      link: "#",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyaGOMQQDc_SuIVWIXGJqDuG5-mLsFj9LNSkkPpBQY20PNM648Bzo2sRMcvePJtB_2yVX3UvBOn42eAr1ggEpxfGQt2suWWVvdbRw3UqN7xKR1CZvbRx9iA3OUiyJFdVc7QTQL4XbC3__KbLZbTS5WHb7pMl89Hvt1OOIduNNm08I8Ibzw2qo7qv2GsgusJn4Si9Lvvu6OZ4qRcGnhN7X89rnU2XZjOb6KmIpTB_SzahGr5zt8-ZuBDNykomz9P20CgVTvskYvZcc",
    },
    {
      id: "6",
      title: "DrHero",
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
