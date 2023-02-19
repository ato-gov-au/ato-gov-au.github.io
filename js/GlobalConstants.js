// Global constants for the error messages.
if (window.EMAIL_ADDRESS_INVALID == null) {
    window.EMAIL_ADDRESS_INVALID = "The Email address provided is not valid.";
}
if (window.EMAIL_ADDRESS_REQUIRED == null) {
    window.EMAIL_ADDRESS_REQUIRED = "Your email address must be provided.";
}
if (window.ABN_REQUIRED == null) {
    window.ABN_REQUIRED = "An ABN is mandatory, please enter a valid ABN.";
}
if (window.STOP_RECEIVING_PAPER_REQUIRED == null) {
    window.STOP_RECEIVING_PAPER_REQUIRED = "An option must be selected.";
}
if (window.ABN_INVALID == null) {
    window.ABN_INVALID = "An incorrect ABN has been entered. Please check the entered ABN is correct and that it contains 11 numbers.";
}

// Global constant class names for the validation.
if (window.INPUT_ERROR_CLASS_NAME == null) {
    window.INPUT_ERROR_CLASS_NAME = "error";
}
if (window.ERROR_MESSAGE_CLASS_NAME == null) {
    window.ERROR_MESSAGE_CLASS_NAME = "errorMessage";
}
if (window.ERROR_MESSAGE_SUMMARY_CLASS_NAME == null) {
    window.ERROR_MESSAGE_SUMMARY_CLASS_NAME = "errorMessageSummary";
}
if (window.ERROR_QUESTION_CLASS_NAME == null) {
    window.ERROR_QUESTION_CLASS_NAME = "errorQuestion";
}
if (window.ERROR_MESSAGE_SUMMARY_TEXT_CLASS_NAME == null) {
    window.ERROR_MESSAGE_SUMMARY_TEXT_CLASS_NAME = "errorMessageSummaryText";
}
if (window.DEFAULT_ERROR_SUMMARY_TEXT == null) {
    window.DEFAULT_ERROR_SUMMARY_TEXT = "The following [ErrorMessageCount] must be corrected before you can submit the form:";
}
if (window.DEFAULT_ERROR_MESSAGE_SUMMARY_CLASS_NAME == null) {
    window.DEFAULT_ERROR_MESSAGE_SUMMARY_CLASS_NAME = "defaultErrorMessageSummaryText";
}
if (window.ERROR_MESSAGE_SUMMARY_LIST_TYPE == null) {
    window.ERROR_MESSAGE_SUMMARY_LIST_TYPE = "ul";
}
if (window.LOCATION_OF_ERROR_MESSAGE_SUMMARY == null) {
    window.LOCATION_OF_ERROR_MESSAGE_SUMMARY = ".danger";
}
if (window.ARIA_ERROR_MESSAGE_CLASS_NAME == null) {
    window.ARIA_ERROR_MESSAGE_CLASS_NAME = "ariaErrorMessage";
}
if (window.ERROR_MESSAGE_ICON_CLASS_NAME == null) {
    window.ERROR_MESSAGE_ICON_CLASS_NAME = "icon-danger";
}
if (window.WRAPPER_CLASS_NAME == null) {
    window.WRAPPER_CLASS_NAME = "form-group";
}
if (window.ERROR_MESSAGE_LINK_CLASS_NAME == null) {
    window.ERROR_MESSAGE_LINK_CLASS_NAME = "fieldset-label";
}
if (window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME == null) {
    window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME = "data-mandatory-other-checkbox-id";
}
if (window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME == null) {
    window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME = "data-mandatory-other-radiobutton-id";
}
if (window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME == null) {
    window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME = "btn-group-vertical";
}
if (window.VALIDATE_FIELD_CLASS_NAME == null) {
    window.VALIDATE_FIELD_CLASS_NAME = "validate";
}
if (window.MINIMUM_SECONDMENT_START_DATE == null) {
    window.MINIMUM_SECONDMENT_START_DATE = "01/10/2002";
}
if (window.DATE_FORMAT_DD_MM_YYYY == null) {
    window.DATE_FORMAT_DD_MM_YYYY = "dd/mm/yyyy";
}
if (window.VALID_FIELD == null) {
    window.VALID_FIELD = 0;
}
if (window.INVALID_MANDATORY_FIELD == null) {
    window.INVALID_MANDATORY_FIELD = 1;
}
if (window.INVALID_DEPENDENT_MANDATORY_FIELD == null) {
    window.INVALID_DEPENDENT_MANDATORY_FIELD = 2;
}
if (window.INVALID_NON_MANDATORY_FIELD == null) {
    window.INVALID_NON_MANDATORY_FIELD = 3;
}

// Global constant values for the validation.
var SCROLL_INTO_MOBILE_VIEW_OFFSET = 70;
var MOBILE_VIEW_WIDTH = 767;
var TAB_KEYCODE = 9;

// SBN subscription form global constant values.
var MAX_ABN_FIELDS_TO_DISPLAY = 10;
var POPULATE_ABN_INPUT_FIELDS_TIMEOUT = 500;
var CREATE_SUBSCRIPTION_TEXT = "Subscribe to get the latest business news and updates";
var MANAGE_SUBSCRIPTION_TEXT = "Manage subscription to business news and updates";
var STOP_RECEIVING_PAPER_NEWS_MESSAGE_YES = "We still need to send communications specifically related to you and your business by post, such as your assessment notices, statements of account and pay as you go instalment notices.";
var STOP_RECEIVING_PAPER_NEWS_MESSAGE_NO = "You will continue to receive this type of information as you have before.  If you change your mind, you can come back and update your preferences at any time.";
var CREATE_SUBSCRIPTION_SUBMIT_BUTTON_TEXT = "Subscribe";
var MANAGE_SUBSCRIPTION_SUBMIT_BUTTON_TEXT = "Update";

// Temporary SBN calendar constant values.
var KEYUP_TIMEOUT = 20;
var DISPLAY_LOADING_WHEEL = true;