/// <reference types="vite/client" />
interface ImportMetaEnv {
  /**
   * Auth0 Domain
   */
  readonly VITE_AUTH0_DOMAIN: string;
  /**
   * Auth0 Client Id
   */
  readonly VITE_AUTH0_CLIENT_ID: string;
  /**
   * Auth0 Audience (API Identifier)
   */
  readonly VITE_AUTH0_AUDIENCE: string;
  /**
   * Workflow Engine URL (Backend)
   */
  readonly VITE_SERVER_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
