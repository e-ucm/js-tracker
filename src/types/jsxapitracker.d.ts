declare module "jsxapitracker" {
  /**
   * Parse URL (or window.location.search) and build an XAPI-Tracker instance
   */
  export function generateXAPITrackerFromURLParams(): any;

  /**
   * Base asset for sending xAPI statements
   */
  export class xAPITrackerAsset {
    constructor(config?: any);
    send(statement: object): Promise<void>;
  }

  /**
   * OAuth1-based xAPI asset
   */
  export class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    constructor(config?: any);
  }

  /**
   * OAuth2-based xAPI asset
   */
  export class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    constructor(config?: any);
  }

  /**
   * High-level “Accessible” tracker
   */
  export class AccessibleTracker {
    constructor(asset: xAPITrackerAsset, opts?: any);
    // …add any known methods here
  }

  /**
   * High-level “Completable” tracker
   */
  export class CompletableTracker {
    constructor(asset: xAPITrackerAsset, opts?: any);
    // …add any known methods here
  }

  /**
   * High-level “Alternative” tracker
   */
  export class AlternativeTracker {
    constructor(asset: xAPITrackerAsset, opts?: any);
    // …add any known methods here
  }

  /**
   * High-level “GameObject” tracker
   */
  export class GameObjectTracker {
    constructor(asset: xAPITrackerAsset, opts?: any);
    // …add any known methods here
  }

  /**
   * High-level “Scorm” tracker
   */
  export class ScormTracker {
    constructor(asset: xAPITrackerAsset, opts?: any);
    // …add any known methods here
  }

  /** Tracker type constants */
  export const ACCESSIBLETYPE: any[];
  export const COMPLETABLETYPE: any[];
  export const ALTERNATIVETYPE: any[];
  export const GAMEOBJECTTYPE: any[];
  export const SCORMTYPE: any[];
}