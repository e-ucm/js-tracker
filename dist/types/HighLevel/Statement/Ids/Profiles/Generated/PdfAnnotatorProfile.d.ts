export const PDFANNOTATORPROFILE: Readonly<{
    CATEGORYID: "http://www.risc-inc.com/annotator/v1.0.";
    VERBS: {
        ANNOTATED: string;
        MODIFIED_ANNOTATION: string;
    };
    ACTIVITYTYPES: {
        FREETEXT_ANNOTATION: string;
        HIGHLIGHTED_TEXT_ANNOTATION: string;
        NOTE_ANNOTATION: string;
        UNDERLINE_ANNOTATION: string;
    };
    ACTIVITYEXTENSION: {};
    CONTEXTEXTENSION: {
        HIGHLIGHTED_STRING: string;
        PAGE_INDEX: string;
        PDF_ANNOTATION_HIGHLIGHT_COLOUR: string;
        PDF_RECTANGLE_MAP: string;
    };
    RESULTEXTENSION: {};
}>;
