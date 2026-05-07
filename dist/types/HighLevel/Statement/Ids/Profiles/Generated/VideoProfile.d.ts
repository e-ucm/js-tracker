export const VIDEOPROFILE: Readonly<{
    CATEGORYID: "https://w3id.org/xapi/video/v/2";
    VERBS: {
        PAUSED: string;
        PLAYED: string;
        SEEKED: string;
    };
    ACTIVITYTYPES: {
        VIDEO: string;
    };
    ACTIVITYEXTENSION: {};
    CONTEXTEXTENSION: {
        CC_SUBTITLE_ENABLED: string;
        CC_SUBTITLE_LANG: string;
        COMPLETION_THRESHOLD: string;
        FRAME_RATE: string;
        FULL_SCREEN: string;
        LENGTH: string;
        QUALITY: string;
        SCREEN_SIZE: string;
        SESSION_ID: string;
        SPEED: string;
        TRACK: string;
        USER_AGENT: string;
        VIDEO_PLAYBACK_SIZE: string;
        VOLUME: string;
    };
    RESULTEXTENSION: {
        PLAYED_SEGMENTS: string;
        PROGRESS: string;
        TIME: string;
        TIME_FROM: string;
        TIME_TO: string;
    };
}>;
