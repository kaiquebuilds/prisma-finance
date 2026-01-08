# ADR 001: Prisma Technology Stack Decision

- **Status:** Accepted
- **Date:** 2026-01-08
- **Decision Owners:** Kaique Borges

## 1. Context

Prisma is a responsive personal finance management web application for Brazilian users, optimized to reduce financial anxiety by delivering predictable, correct, explainable financial views (cash flow, obligations, budgets, projections). The MVP is **manual input only** (no bank integrations).

Key constraints and decisiondrivers:

1. **Correctness & trust:** financial calculations must be consistent, reproducible, and resilient to rounding/locale/time pitfalls.
2. **Execution speed:** choose a stack that is simple enough to ship and minimize context switching as a solo builder while remaining suited for production environments.
3. **Fast iteration with low regression risk:** the system must support changing requirements with clear boundaries and testable logic.
4. **Sandbox mode:** The app requires complex client-side calculations ("What if I spend this?") that must exactly match backend logic.
5. **Portfolio-grade engineering**: The project must demonstrate strong capability in real-world product development scenarios, from defining product strategy to designing, building, and operating a production system.

## 2. Decision

### 2.1. Programming Language: TypeScript

We will use TypeScript for both frontend and backend development.

**Rationale:**

- Strong typing reduces runtime errors and improves developer productivity.
- Since it will already be used in the frontend, use it on the backend as well to reduce context switching.
- Enables sharing types and code between client and server, avoiding duplication (sandbox mode calculations).

### 2.2. Project Structure: Monorepo

We will use a monorepo structure to house both frontend and backend code, along with shared packages.

**Rationale:**

- For sandbox mode, we need to share calculation logic between frontend and backend for consistency and validation. A monorepo simplifies this sharing.
- Full-stack features can be developed, tested, and committed together, reducing integration friction.

### 2.3 Frontend: React + Next.js

We will use React with Next.js for the frontend application.

**Rationale:**

- React is a mature, widely-used library with a strong ecosystem that can be leveraged to improve development speed.
- Next.js provides first-class performance benefits like code-splitting, cache invalidation, and server-side rendering.

### 2.4. Backend: Node.js + Express

We will use Node.js with Express for the backend API.

**Rationale:**

- Node.js is a mature, widely-used runtime environment with excellent TypeScript support.
- Express is a minimal and flexible web framework that has a strong ecosystem.
- Express' minimalism allows us to enforce architecture through layering and boundaries rather than framework conventions, an opportunity to master software design and implementation.

### 2.5. Database: PostgreSQL (Prisma ORM)

We will use PostgreSQL with Prisma ORM for data persistence.

**Rationale:**

- PostgreSQL's strong ACID compliance and relational model constraints are well-suited for financial data integrity.
- Prisma provides type-safe database access and migrations, reducing boilerplate and improving developer productivity.

### 2.6. Testing: Vitest, Supertest, Playwright

We will use Vitest for unit testing, Supertest for API testing, and Playwright for end-to-end testing

**Rationale:**

- Vitest provides fast, reliable unit testing with excellent Vite integration and TypeScript support.
- Supertest offers robust API testing capabilities for backend services.
- Playwright offers robust end-to-end testing capabilities for web applications, simulating interactions in different browsers.

### 2.7. DevOps: Docker Compose, GitHub Actions

We will use Docker Compose for local development and GitHub Actions for CI/CD.

**Rationale:**

- Docker Compose simplifies local environment setup and ensures consistency across development machines.
- GitHub Actions provides a flexible CI/CD solution that can automate testing and deployment workflows, integrating well with the GitHub ecosystem.

### 2.8. Infrastructure: AWS

We will deploy the application on AWS using container-based compute (ECS/Fargate-style runtime), secrets management (AWS Secrets Manager), centralized logging (AWS CloudWatch), and IAM for least-privilege access.

**Rationale:**

- AWS provides a mature, scalable, and secure cloud platform with a wide range of services that can support the application's needs.
- Container-based compute allows for easy scaling and management of application instances.
- AWS Secrets Manager and IAM provide robust security features for managing sensitive information and access control.
- Centralized logging with CloudWatch enables effective monitoring and troubleshooting of the application.

## 3. Alternatives Considered

- **React Single-Page Application (SPA):** Considered but rejected in favor of Next.js for its performance optimizations and server-side rendering capabilities. We can achieve the same SPA-like experience with Next.js while gaining additional benefits.
- **Other Frontend Frameworks (Vue, Angular):** Rejected in favor of React due to its maturity, ecosystem, and personal familiarity.
- **NestJS (or other opinionated frameworks):** Rejected to avoid framework-driven architecture and showcase software design skills.
- **Other Databases (MySQL, MongoDB):** Rejected in favor of PostgreSQL due to its strong ACID compliance and relational model, which are critical for financial data integrity.
- **Other Cloud Providers (GCP, Azure):** Rejected in favor of AWS due to its maturity, service offerings, and personal familiarity.
- **Other Testing Frameworks (Jest, Mocha):** Rejected in favor of Vitest due to its speed and Vite integration.
- **Other DevOps Tools (Terraform, Jenkins):** Rejected in favor of Docker Compose and GitHub Actions for their simplicity and ease of use in a solo developer context.
- **Other Languages (Python, Go):** Rejected in favor of TypeScript for its strong typing, ecosystem, and ability to share code between frontend and backend.
- **Separate Repositories for Frontend and Backend:** Rejected in favor of a monorepo to facilitate code sharing and reduce integration friction.
- **Serverless Backend (AWS Lambda):** Rejected in favor of a container-based approach to maintain control over the runtime environment and simplify local development.
- **Other ORMs (TypeORM, Sequelize):** Rejected in favor of Prisma for its type safety and developer experience.
- **Other CI/CD Tools (Travis CI, CircleCI):** Rejected in favor of GitHub Actions for its integration with the GitHub ecosystem and flexibility.
- **Duplicated Calculation Logic:** Rejected in favor of a shared deterministic engine to ensure consistency and trustworthiness in sandbox mode.

## 4. Consequences

### 4.1. Positive

- Strong type safety across the stack.
- Ability to share code between frontend and backend for sandbox mode.
- Minimized boilerplate and improved developer productivity with Prisma ORM.
- Mature, widely-used technologies with strong community support.
- Scalable and secure infrastructure on AWS.
- Fast development and iteration cycles.
- Robust testing strategy covering unit, API, and end-to-end tests.
- Simplified local development with Docker Compose.
- Automated CI/CD workflows with GitHub Actions.
- Portfolio-grade engineering practices demonstrated.
- Flexibility to adapt and evolve the architecture as needed.
- Strong foundation for future growth and complexity.
- Reduced context switching for the solo developer.

### 4.2. Negative

- Prisma ORM complex queries may be suboptimal or inexistent. Mitigation: use raw SQL queries when necessary.
- Express lack of built-in structure may lead to inconsistent code organization. Mitigation: enforce architecture through layering and boundaries.
- Possible overengineering for a solo developer context. Mitigation: adopt an emergent and iterative approach to architecture.
- Maintenance overhead of multiple technologies and tools. Mitigation: prioritize simplicity and only adopt tools that provide clear value.
- Dependence on AWS services may lead to vendor lock-in. Mitigation: design the architecture to be as cloud-agnostic as possible.
