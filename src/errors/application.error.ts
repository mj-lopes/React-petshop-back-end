export type ErrorConfigSetting<T> = {
  log?: string;
  messagekey?: string;
  data?: T;
};

export const DEFAULT_ERROR_CONFIG: ErrorConfigSetting<void> = {
  log: "Um erro inesperado ocorreu",
  messagekey: "erro-inesperado",
};

export class ApplicationError<T> extends Error {
  constructor(public config: ErrorConfigSetting<T>) {
    super(config.log || DEFAULT_ERROR_CONFIG.log);
    if (!config.messagekey) {
      config.messagekey = DEFAULT_ERROR_CONFIG.messagekey;
    }
  }
}
