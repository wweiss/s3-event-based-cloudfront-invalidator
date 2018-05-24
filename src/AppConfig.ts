export class AppConfig {
  public readonly distributionId = process.env['DISTRIBUTION_ID'];
  private _invalidationPaths = AppConfig.valueOrNull('INVALIDATION_PATHS');

  static valueOrNull(key: string): string {
    let rval = process.env[key];
    if (!rval || rval.length < 1) {
      rval = null;
    }
    return rval;
  }

  get invalidationPaths(): string[] {
    let rval = [];
    let raw = this._invalidationPaths;
    if (raw) {
      rval = raw.split(',');
    }
    return rval;
  }
}
