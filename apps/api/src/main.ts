import 'reflect-metadata';
import { createApp } from './bootstrap';

const PORT = Number(process.env.PORT ?? 3333);

async function bootstrap(): Promise<void> {
  const app = await createApp();
  await app.listen(PORT);
  console.log(`API FACOM simulée démarrée sur http://localhost:${PORT}/api`);
}

void bootstrap();
