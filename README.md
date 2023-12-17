# storedge-core

The backbone of Storedge, an innovative headless Content Management System (CMS) designed specifically for e-commerce platforms. This repository is dedicated to the API that powers Storedge, constructed on the strong foundations of GraphQL with TypeGraphQL and Prisma. Our mission is to provide a modular, up-to-date, self-hosted, and open-source alternative inspired by the renowned Shopify.

## Features

- **GraphQL API**: Empower your e-commerce platform with efficient data queries and mutations using GraphQL.
- **TypeGraphQL & Prisma**: Streamline your development with strong typing and advanced ORM capabilities.
- **Modularity**: Our API's modular design allows for easy customization and extension.
- **Self-hosted & Open-source**: Keep full control of your data with self-hosting and enjoy the flexibility of open-source for customization.

## Getting Started

Clone the `storedge-core` repository to begin:

```bash
git clone https://github.com/suiramdev/storedge-core.git
cd storedge-core
```

### Prerequisites

Ensure you have the following installed:
- Node.js (version v16.20.X or above)
- A supported SQL database (e.g., PostgreSQL)

### Installation

Install the dependencies with `pnpm`:

```bash
pnpm install
```

### Configuration

Set up your environment variables:

```bash
cp .env.example .env
# Make sure to edit the .env file with your database details and other configurations
```

### Initializing the Database

Before starting the server, initialize your database schema:

```bash
pnpm prisma db push
```

Seed your database with initial data:

```bash
pnpm seed
```

### Building the Application

Compile the TypeScript source to JavaScript:

```bash
pnpm build
```

### Running the Server

Finally, launch the storedge-core server:

```bash
pnpm start
```

Your GraphQL API is now running and can be accessed at `http://localhost:4000/graphql`.

## Architecture Overview

Storedge's architecture is divided into core and apps layers:

- **Core**: Houses the database, services, and gateway, orchestrating the business logic and data persistence.
- **Apps**: This layer contains the storefront and dashboard interfaces. (e.g, <https://github.com/suiramdev/storedge-dashboard>)

![Architecture overview schema](https://i.imgur.com/EVUxTUt.png)

### File Handling

- **File Downloading**: To securely download files, clients request a presigned URL from the gateway, granting access to the object storage.
- **File Uploading**: For uploads, clients use a presigned URL to send files directly to object storage, enhancing security and performance.

![File handling schema](https://i.imgur.com/XSkmu4O.png)

## Contributing

Contributions are welcome! Please refer to the CONTRIBUTING.md file for guidelines on submitting pull requests.

## License

Storedge-Core is licensed under the MIT License. See the LICENSE.md file for more details.
