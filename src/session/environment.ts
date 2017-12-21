declare const process: any;

/**
 * Determine what value the Webpack DefinePlugin set at compile-time.
 */
function getNodeEnv(): string {
  return process.env.NODE_ENV;
}

class Environment {
  readonly development: boolean;
  readonly production: boolean;
  constructor() {
    this.development = false;
    this.production = false;

    switch (getNodeEnv()) {
      case 'development':
        this.development = true;
        break;
      case 'production':
        this.production = true;
        break;
    }
  }
}

export default new Environment();
