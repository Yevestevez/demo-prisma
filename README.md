# Films

Ejemplo de API implementada con Node.js, Express y Prisma para gestionar películas, géneros, reviews y usuarios (profile).

## Instalación

- Clonar el repositorio
- Instalar dependencias con `npm install`
- Configurar variables de entorno en un archivo `.env` (puedes usar el archivo `.env.example` como plantilla)
- Las variables de entorno incluyen la URL de conexión a la base de datos. Nos aseguramos de que la base de datos esté configurada y accesible antes de ejecutar las migraciones.
- Generar el cliente de Prisma con `npx prisma generate`
- Ejecutar migraciones para crear la base de datos con `npx prisma migrate dev`
- Iniciar el servidor con `npm start` o `npm run dev` para modo desarrollo.

Vitest:

```shell
npm i -D vitest @vitest/coverage-v8
```

- Script para ejecutar tests:

```json
"scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
}
```

- Agregar un archivo de configuración para Vitest, por ejemplo `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        setupFiles: './src/config/setup-test.ts',
    },
});
```

- Crear un archivo de configuración para pruebas, por ejemplo `src/config/setup-test.ts`, donde se pueden configurar variables de entorno específicas para las pruebas o realizar cualquier configuración necesaria antes de ejecutar los tests.

```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile('.env.test');
```

## Estructura del proyecto

La estructura del proyecto se organiza de la siguiente manera:

```
├── src
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── prisma
│   ├── app.ts
│   └── server.ts
├── prisma
│   ├── schema.prisma
│   ├── prisma.test.config.ts
│   └── seed.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Relación entre las tablas

películas -- n:n --> géneros

[películas ---n:n---> usuarios]
películas --1:n ---> reviews
usuarios ---1:n -----> reviews

usuarios ---1:1 -----> profile

## EndPoints

```text
[GET] /api/películas
[GET] /api/películas/:id
[POST] /api/películas [Admin/Editor]
[PATCH] /api/películas/:id [Admin/Editor]
[DELETE] /api/películas/id [Admin/Editor]

[POST] /api/user/registro
[POST] /api/user/login
[GET] /api/user/:id
[PATCH] /api/user/:id [Owner]
[DELETE] /api/user/:id [Owner,Admin]

[GET] /api/reviews [User]
[GET] /api/reviews/:id [User]
[POST] /api/reviews [User]
[PATCH] /api/reviews/:id [Owner]
[DELETE] /api/reviews/id [Owner,Admin]
```
