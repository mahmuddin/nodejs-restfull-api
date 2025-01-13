Init Prisma

```bash
npx prisma init --datasource-provider "mysql"
```

Setting Prisma Client

```bash
npx prisma generate
```

Creating the Database

```bash
npx prisma migrate dev --create-only
```

Migrating the Database

```bash
npx prisma migrate dev
```

Setting Environment Variables

```bash
DATABASE_URL="mysql://root:@localhost:3306/belajar_nodejs_dasar"
```

Running the Server

```bash
npm run dev
```

Testing the Server

```bash
npm run test
```
