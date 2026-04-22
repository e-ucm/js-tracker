// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
export const PDFANNOTATORPROFILE = Object.freeze({
    CATEGORYID: 'http://www.risc-inc.com/annotator/v1.0.',
    VERBS: {
        ANNOTATED: 'http://risc-inc.com/annotator/verbs/annotated',
        MODIFIED_ANNOTATION: 'http://risc-inc.com/annotator/verbs/modified',
    },
    ACTIVITYTYPES: {
        FREETEXT_ANNOTATION: 'http://www.risc-inc.com/annotator/activities/freetext',
        HIGHLIGHTED_TEXT_ANNOTATION: 'http://risc-inc.com/annotator/activities/highlight',
        NOTE_ANNOTATION: 'http://risc-inc.com/annotator/activities/note',
        UNDERLINE_ANNOTATION: 'http://risc-inc.com/annotator/activities/underline',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        HIGHLIGHTED_STRING: 'http://www.risc-inc.com/annotator/extensions/highlightedString',
        PAGE_INDEX: 'http://www.risc-inc.com/annotator/extensions/page',
        PDF_ANNOTATION_HIGHLIGHT_COLOUR: 'http://www.risc-inc.com/annotator/extensions/color',
        PDF_RECTANGLE_MAP: 'http://www.risc-inc.com/annotator/extensions/rects',
    },
    RESULTEXTENSION: {}
});
