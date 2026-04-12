import { join } from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const env = process.env.NODE_ENV || 'development';
const yamlConfig = (() => {
  const filePath = join(__dirname, '..', '..', 'config', `.env.${env}.yaml`);
  return fs.existsSync(filePath)
    ? (yaml.load(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>)
    : {};
})();

function get<T>(envKey: string, yamlPath: string, defaultValue?: T): T {
  const yamlValue = yamlPath
    .split('.')
    .reduce((obj, key) => (obj as Record<string, unknown>)?.[key], yamlConfig);
  return (process.env[envKey] as T) ?? (yamlValue as T) ?? (defaultValue as T);
}

export default () => ({
  database: {
    type: get<string>('DB_TYPE', 'database.type', 'postgres'),
    host: get<string>('DB_HOST', 'database.host'),
    port: get<number>('DB_PORT', 'database.port'),
    username: get<string>('DB_USER', 'database.username'),
    password: get<string>('DB_PASSWORD', 'database.password'),
    database: get<string>('DB_NAME', 'database.database'),
  },
  jwt: {
    secret: get<string>('JWT_SECRET', 'jwt.secret'),
    expiresIn: get<string>('JWT_EXPIRES_IN', 'jwt.expiresIn', '7d'),
  },
  app: {
    port: get<number>('APP_PORT', 'app.port', 3000),
    baseUrl: get<string>('APP_BASE_URL', 'app.baseUrl'),
  },
  upload: {
    directory: get<string>(
      'UPLOAD_DIRECTORY',
      'upload.directory',
      join(__dirname, '..', '..', 'uploads')
    ),
  },
  cors: {
    origins: get<string>('CORS_ORIGINS', 'cors.origins'),
  },
  ai: {
    llm: {
      model: get<string>('AI_LLM_MODEL', 'ai.llm.model'),
      apiKey: get<string>('AI_LLM_API_KEY', 'ai.llm.apiKey'),
      chatUrl: get<string>('AI_LLM_CHAT_URL', 'ai.llm.chatUrl'),
      searchUrl: get<string>('AI_LLM_SEARCH_URL', 'ai.llm.searchUrl'),
    },
    ollama: {
      model: get<string>('AI_OLLAMA_MODEL', 'ai.ollama.model'),
      url: get<string>('AI_OLLAMA_URL', 'ai.ollama.url'),
    },
  },
});
