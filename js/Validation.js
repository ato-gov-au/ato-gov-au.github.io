$(document).ready(function () {
    // Intitialise fields.
 $("." + window.ERROR_MESSAGE_CLASS_NAME).hide();   
$("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).hide();
Validation.setIndexToErrorMessages();
    $.widget("ato.validate", {
        options: {
            errorFieldId: "errorMessageId",
            errorMessage: "Invalid text has been entered.",
            secondErrorMessage: "",
            thirdErrorMessage: "",
            fourthErrorMessage: "",
            mandatoryMessage: "Text must be entered.",
            validationType: "textonly",
            secondValidationType: "",
            thirdValidationType: "",
            fourthValidationType: "",
            dependentGroupId: "",
            dependentFieldId: "",
            dependentMandatoryFieldId: "",
            dependentMandatoryErrorMessage: "",
            dependentRangeId: "",
            secondDependentRangeId: "",
            dependentRangeType: "",
            secondDependentRangeType: "",
            hasSharedInputErrorField: false,
            hideOtherInputField: true,
            showErrorSummaryText: true
        },
        //Initialises setting the event handlers to the input field for validation.
        _create: function () {
            var self = this;
            if ($("#" + self.element[0].id).length != 0) {
                if ($("#" + self.element[0].id).is(":text") || $("#" + self.element[0].id).is("textArea")) {
                    this.bindTextFieldValidation(self);
                } else {
                    switch (self.options.validationType) {
                        case "checkboxes":
                            this.bindCheckboxValidation(self);
                            break;
                        case "radiobuttons":
                            this.bindRadioButtonValidation(self);
                            break;
                        case "dropdownlist":
                            this.bindDropDownListValidation(self);
                            break;
                        default:
                    }
                }
            }
        },
        // Binds the validation for the checkbox event.
        bindCheckboxValidation: function (checkbox) {
            if ($("#" + checkbox.element[0].id + " :checkbox").length > 0) {
                $("#" + checkbox.element[0].id + " :checkbox").bind("validate", function (event, showSummaryOfError) {
                    if ($(this).data("ignore") == false
                        || $(this).data("ignore") == undefined
                        || $(this).data("ignore") == null) {
                        if (!((checkbox.options.errorMessage.length == 0) && (checkbox.options.mandatoryMessage.length == 0))) {
                            var isValidCheckbox = checkbox.validateField(checkbox.element[0].id, checkbox.options, showSummaryOfError);
                            $(this).data("valid", isValidCheckbox);
                        }
                    }
                }).click(function () {
                    // Hide the other input field if the other checkbox is not checked.
                    if ($(this) != undefined && checkbox.options.hideOtherInputField) {
                        ($(this).is(":checked")) ?
							$("input").filterByAttributeValue(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME, this.id).slideDown()
							: $("input").filterByAttributeValue(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME, this.id).slideUp();
                        // Hide the other input field and clear any error messages or summary error message text.
                        checkbox.clearOtherInputFieldError(checkbox, window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME);
                    }
                    // Validate the radio button & other input field if exists.
                    $(this).trigger("validate", false);
                    if ($("input").filterByAttributeValue(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME, this.id).length > 0) {
                        $("input").filterByAttributeValue(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME, this.id).trigger("validate", false);
                    }
                }).focusout(function () {
                    // Perform validation if none of the other checkboxes have focus.
                    var checkbox = this;
                    var checkboxFocusoutTimeout = window.setTimeout(function () {
                        if (!$(checkbox).getInputFieldHasFocus("." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME)) {
                            $(checkbox).trigger("validate", true);
                        }
                        clearTimeout(checkboxFocusoutTimeout);
                    }, 0);
                });
            }
            // Hide the other input text field on page load.
            if (checkbox.options.hideOtherInputField) {
                $("#" + checkbox.element[0].id + " :input").filterByAttributeName(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME).slideUp();
            }
        },
        // Binds the validation for the drop-down list event.
        bindDropDownListValidation: function (dropDownList) {
            $("#" + dropDownList.element[0].id).bind("validate", function (event, showSummaryOfError) {
                if ($(this).data("ignore") == false
                    || $(this).data("ignore") == undefined
                    || $(this).data("ignore") == null) {
                    var isValidDropDownList = dropDownList.validateField(dropDownList.element[0].id, dropDownList.options, showSummaryOfError);
                    $(this).data("valid", isValidDropDownList);
                }
            }).click(function () {
                if ($(this).data("dirty")) {
                    $(this).trigger("validate", false);
                }
            }).blur(function () {
                $(this).trigger("validate", true);
            }).change(function () {
                if ($(this).data("dirty") == undefined) {
                    $(this).data("dirty", true);
                }
            });
        },
        // Binds the validation for the radio buttons event.
        bindRadioButtonValidation: function (radioButton) {
            if ($("#" + radioButton.element[0].id + " :radio").length > 0) {
                $("#" + radioButton.element[0].id + " :radio").bind("validate", function (event, showSummaryOfError) {
                    if ($(this).data("ignore") == false
                        || $(this).data("ignore") == undefined
                        || $(this).data("ignore") == null) {
                        if (!((radioButton.options.errorMessage.length == 0) && (radioButton.options.mandatoryMessage.length == 0))) {
                            var isValidRadioButton = radioButton.validateField(radioButton.element[0].id, radioButton.options, showSummaryOfError);
                            $(this).data("valid", isValidRadioButton);
                        }
                    }
                }).click(function () {
                    // Check other radio button has been checked.
                    var otherRadioButton = $("#" + radioButton.element[0].id + " :radio").filter(function () {
                        return this.id == $("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, this.id).attr(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME);
                    });
                    if (otherRadioButton.length > 0) {
                        // Show or hide the other input field if the matching other radio button has been selected.
                        if ($(otherRadioButton).is(":checked") && radioButton.options.hideOtherInputField) {
                            // Show the other input field
                            $("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, otherRadioButton.attr("id")).slideDown();
                        } else {
                            // Hide the other input field and clear any error messages or summary error message text.
                            radioButton.clearOtherInputFieldError(radioButton, window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME);
                            if (radioButton.options.showErrorSummaryText) {
                                radioButton.showSummaryOfErrors(true, $("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, $(otherRadioButton).attr("id")).attr("id"), radioButton.options.errorFieldId, "");
                            }
                            if (radioButton.options.hideOtherInputField) {
                                $("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, otherRadioButton.attr("id")).slideUp();
                            }
                        }
                    }
                    // Validate the radio button & other input field if exists.
                    $(this).trigger("validate", false);
                    if ($("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, this.id).length > 0) {
                        $("input").filterByAttributeValue(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME, this.id).trigger("validate", false);
                    }
                }).focusout(function () {
                    // Perform validation if none of the other checkboxes has focus.
                    var radiobutton = this;
                    var radiobutoonFocusoutTimeout = window.setTimeout(function () {
                        if (!$(radiobutton).getInputFieldHasFocus("." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME)) {
                            $(radiobutton).trigger("validate", true);
                        }
                        clearTimeout(radiobutoonFocusoutTimeout);
                    }, 0);
                });
            }
            if (radioButton.options.hideOtherInputField) {
                $("#" + radioButton.element[0].id + " :input").filterByAttributeName(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME).slideUp();
            }
        },
        // Binds the validation for the input textbox and texarea events.
        bindTextFieldValidation: function (textField) {
            var activeElementId;
            $("#" + textField.element[0].id).bind("validate", function (event, showSummaryOfError, validateDependentMandatoryFields) {
                if ($(this).data("ignore") == false
                    || $(this).data("ignore") == undefined
                    || $(this).data("ignore") == null) {
                    if ($("#" + $(this).attr(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME)).is(":checked")
					|| $("#" + $(this).attr(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME)).is(":checked")
					|| ($(this).attr(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME)) == undefined
					&& ($(this).attr(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME)) == undefined) {
                        if ($(this).data("dirty") == true || $(this).data("mandatory") == true) {
                            //set validateDependentMandatoryFields
                            if (textField.options.dependentRangeId.length > 0
                               || textField.options.secondDependentRangeId.length > 0) {
                                $(this).removeData("errorCode");
                            }
                            textField.options.validateDependentMandatoryFields = validateDependentMandatoryFields;
                            // Validate the first set of rules.
                            textFieldValidation = textField.validateField(this.id, textField.options, showSummaryOfError);
                            if ((textField.options.dependentMandatoryFieldId == this.id
							&& textField.options.hasSharedInputErrorField
							&& validateDependentMandatoryFields)) {
                                var inputFieldsGroup = $("input:text").getOtherInputFieldGroup(this.id, textField.options.dependentGroupId);
                                if (textFieldValidation.errorCode == window.INVALID_DEPENDENT_MANDATORY_FIELD) {
                                    $(inputFieldsGroup).each(function () {
                                        textField.showSummaryOfErrors(true, this.id, $(this).validate("option").errorFieldId, "");
                                        $(this).addClass(window.INPUT_ERROR_CLASS_NAME);
                                        $(this).data("valid", false);
                                        $(this).data("errorCode", textFieldValidation.errorCode);
                                    });
                                } else {
                                    $(inputFieldsGroup).each(function () {
                                        $(this).removeClass(window.INPUT_ERROR_CLASS_NAME);
                                        $(this).data("valid", true);
                                        $(this).data("errorCode", textFieldValidation.errorCode);
                                    });
                                }
                            } else if (textField.options.dependentGroupId.length > 0
							  && textField.options.hasSharedInputErrorField
							  && !textFieldValidation.isValid) {
                                var inputFieldsGroup = $("input:text").getOtherInputFieldGroup(this.id, textField.options.dependentGroupId);
                                $(inputFieldsGroup).each(function () {
                                    $(this).parents("." + window.WRAPPER_CLASS_NAME).find("label").removeClass(window.ERROR_QUESTION_CLASS_NAME);
                                    $(this).removeClass(window.INPUT_ERROR_CLASS_NAME);
                                    $(this).data("valid", true);
                                    $(this).data("errorCode", textFieldValidation.errorCode);
                                });
                            } else {
                                textField.setDependentFieldsErrorCode(this, textFieldValidation.isValid, textField.options);
                            }
                            // Validate the second set of rules.
                            if (textFieldValidation.isValid && textField.options.secondValidationType.length > 0
							&& !validateDependentMandatoryFields) {
                                textFieldValidation = textField.validateField(this.id, textField.options, showSummaryOfError, 1);
                                textField.setDependentFieldsErrorCode(this, textFieldValidation.isValid, textField.options);
                                // Validate the third set of rules.
                                if (textFieldValidation.isValid && textField.options.thirdValidationType.length > 0) {
                                    textFieldValidation = textField.validateField(this.id, textField.options, showSummaryOfError, 2);
                                    textField.setDependentFieldsErrorCode(this, textFieldValidation.isValid, textField.options);
                                    // Validate the fourth set of rules.
                                    if (textFieldValidation.isValid && textField.options.fourthValidationType.length > 0) {
                                        textFieldValidation = textField.validateField(this.id, textField.options, showSummaryOfError, 3);
                                    }
                                }
                            }
                            $(this).data("valid", textFieldValidation.isValid);
                            $(this).data("errorCode", textFieldValidation.errorCode);
                        }
                    } else if (!$("#" + $(this).attr(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME)).is(":checked")
					  || !$("#" + $(this).attr(window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME)).is(":checked")) {
                        // Clear any error validation messages if other checkbox or radio button is checked.
                        if ($("#" + textField.element[0].id).parent().find(":checkbox").is(":checked")
						|| $("#" + textField.element[0].id).parent().find(":radio").is(":checked")) {
                            // If any of the checkboxes / radio buttons is checked then remove validation message.
                            textField.hideOrShowMessage(textField.options.errorFieldId, textField.element[0].id, textField.options.errorMessage, false);
                        } else {
                            // Remove the error class if any of the checkboxes / radio buttons is not checked.
                            $("#" + textField.element[0].id).removeClass("." + window.INPUT_ERROR_CLASS_NAME);
                            $(this).data("valid", true);
                        }
                        // Clear the error message summary.
                        if (textField.options.showErrorSummaryText) {
                            textField.showSummaryOfErrors(true, textField.element[0].id, textField.options.errorFieldId, "");
                        }
                    }
                }
            }).blur(function (event) {
                var inputField = this;
                var textfieldBlurTimeout = window.setTimeout(function () {
                    // Validate the input field once the user loses focus on the the input text field.
                    if ($("#" + $(inputField).attr(window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME)).is(":checked")) {
                        $(inputField).data("dirty", true);
                    }
                    // Flag the mandatory input text fields for validation if it has lost focus.
                    if (!$(inputField).inputFieldsGroupHasFocus(textField.options.dependentRangeId)
                    && textField.options.dependentRangeId.length > 0) {
                        // For input text fields that have a date from and to range.
                        $(inputField).data("mandatory", true);
                        $("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.dependentRangeId, false).data("mandatory", true);
                        $("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.secondDependentRangeId, true).data("mandatory", true);
                    }
                    else if (!$(inputField).inputFieldsGroupHasFocus(textField.options.dependentGroupId)
					&& textField.options.dependentGroupId.length > 0
					&& (textField.options.dependentRangeId.length == 0
					|| $("input:text").getDependentMandatoryField(textField.options.dependentGroupId).length > 0)) {
                        // For input fields that are dependent as part of group.
                        var inputFieldsGroup = $("input:text").getInputFieldGroup(textField.options.dependentGroupId);
                        $(inputFieldsGroup).each(function () {
                            $(this).data("mandatory", true);
                        });
                    } else if (textField.options.dependentGroupId.length == 0
					&& textField.options.mandatoryMessage.length > 0
					&& $("input:text").getDependentMandatoryField(textField.options.dependentGroupId).length == 0) {
                        // For input text fields that is not dependent as a group.
                        $(inputField).data("mandatory", true);
                    }
                    $(inputField).trigger("keyup", true); // Trigger the keyup() event to handle calls executing the validation.
                    clearTimeout(textfieldBlurTimeout);
                }, 0);
            }).keydown(function () {
                // Store the current active element which is primarily used to determine validating dependent fields that are part of a group.
                activeElementId = document.activeElement.id;
            }).keyup(function (event, showSummaryOfError) {
                if (showSummaryOfError === undefined) {
                    var showSummaryOfError = false;
                }
                // Trigger the validation for the input fields.
                if (textField.options.dependentGroupId.length > 0
				&& textField.options.dependentRangeId.length == 0
				&& $("input:text").getDependentMandatoryField(textField.options.dependentGroupId).length > 0) {
                    // For input fields that are dependent as part of group and mandatory.
                    if ($(this).inputFieldsGroupHasFocus()) {
                        // If the other input field has focus then don't update the error message summary.
                        showSummaryOfError = false;
                    }
                    var dependentMandatoryFieldId = $("input:text").getDependentMandatoryField(textField.options.dependentGroupId).validate("option").dependentMandatoryFieldId;
                    $("#" + dependentMandatoryFieldId).trigger("validate", [showSummaryOfError, true])
                    // Then validate the rest of the dependent input fields.
                    textField.validateOtherFieldsHandle(dependentMandatoryFieldId, textField.options.dependentGroupId, showSummaryOfError);
                } else if (textField.options.dependentGroupId.length > 0
				    && textField.options.dependentRangeId.length == 0
                    && textField.options.hasSharedInputErrorField) {
                    // For input fields that are dependent as part of a group but not mandatory.
                    if (document.activeElement.id != activeElementId) {
                        // Validate all invalid dependent input fields if the current input field has lost focus.
                        var invalidInputFieldsGroup = $("input:text").getInvalidInputFieldGroup(textField.options.dependentGroupId);
                        $(invalidInputFieldsGroup).each(function () {
                            if ($(this).data("valid") == false) {
                                $(this).trigger("validate", [showSummaryOfError, false]);
                            }
                        });
                        // Perform validation of all valid input fields if there are no invalid input fields.
                        if (!($(invalidInputFieldsGroup).inputFieldsGroupIsInvalid(textField.options.dependentGroupId))) {
                            // Validate the current input field that has received focus.
                            $(this).trigger("validate", [showSummaryOfError, false]);
                            if ($(this).data("valid") == true) {
                                // Validate all other valid input fields.
                                var otherInputFieldGroup = $("input:text").getOtherInputFieldGroup($(this).attr("id"), textField.options.dependentGroupId).getValidInputFieldGroup(textField.options.dependentGroupId);
                                $(otherInputFieldGroup).each(function () {
                                    $(this).trigger("validate", [showSummaryOfError, false]);
                                    if ($(this).data("valid") == false) {
                                        return false;
                                    }
                                });
                            }
                        }
                    } else {
                        // Validate the current input field if it stil is in focus.
                        $(this).trigger("validate", [showSummaryOfError, false]);
                        if ($(this).data("valid") == true) {
                            // Validate the other dependent input fields.
                            textField.validateOtherFieldsHandle($(this).attr("id"), textField.options.dependentGroupId, showSummaryOfError);
                        }
                    }
                    // Clear the error message summary if the other input fields are valid.
                    if (showSummaryOfError) {
                        var otherInputFieldGroup = $("input:text").getValidInputFieldGroup(textField.options.dependentGroupId);
                        $(otherInputFieldGroup).each(function () {
                            textField.showSummaryOfErrors(true, this.id, $(this).validate("option").errorFieldId, "");
                        });
                    }
                } else if (textField.options.dependentGroupId.length == 0) {
                    // For input fields that is not part of a dependent group.

                    $(this).trigger("validate", [showSummaryOfError, false]);
                    // If the input field is part of a dependent range group validate the other dependent range field.
                    if (textField.options.dependentRangeId.length > 0) {
                        if ($("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.dependentRangeId, false).data("dirty") == true) {
                            $("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.dependentRangeId, false).trigger("validate", [showSummaryOfError, false]);
                        }
                    }
                    if (textField.options.secondDependentRangeId.length > 0) {
                        if ($("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.secondDependentRangeId, true).data("dirty") == true) {
                            $("input:text").getOtherInputDependentField(textField.element[0].id, textField.options.secondDependentRangeId, true).trigger("validate", [showSummaryOfError, false]);
                        }
                    }
                }
            }).change(function () {
                // Mark the input text field as dirty if data has been entered for the first time.
                if ($(this).data("dirty") == undefined || $(this).data("dirty") == false) {
                    $(this).data("dirty", true);
                }
            });
        },
        // Checks if an error or mandatory message is already displayed to the user below the input field and in the error message summary. Returns true if it is.
        checkErrorMessageExists: function (inputFieldId, errorFieldId, errorMessage) {
            return ($("#" + errorFieldId).html() == errorMessage
                && $("." + inputFieldId + "ErrorSummary").siblings("." + window.ERROR_MESSAGE_SUMMARY_TEXT_CLASS_NAME).html() == errorMessage)
                ? true : false;
        },
        // Clears the in-line error message displayed for the outher input text field. 
        clearOtherInputFieldError: function (inputElement, otherInputIdAttributeName) {
            if (!$(inputElement.element).otherCheckboxOrRadioButtonChecked(otherInputIdAttributeName)) {
                // Find the matching other input text field.
                var otherInputFields = $(inputElement.element + ":input").filter(function () {
                    return $(this).attr(otherInputIdAttributeName) != undefined;
                });
                $(otherInputFields).each(function () {
                    // Clear the in-line error message.
                    inputElement.hideOrShowMessage(inputElement.options.errorFieldId, this.id, inputElement.options.errorMessage, false);
                    // Clear the attributes to the input text field.
                    $(this).data("valid", true);
                    $(this).data("errorCode", VALID_FIELD);
                    $(this).data("dirty", false);
                    $(this).data("mandatory", false);
                });
            }
        },
        // Hides or shows the error message to the user.
        hideOrShowMessage: function (errorFieldId, inputFieldId, errorMessage, showError) {
            $("#" + errorFieldId).empty(); // Remove existing error messages.
            if (showError) {
                $("#" + errorFieldId).show();
                $("#" + errorFieldId).siblings("." + window.ERROR_MESSAGE_ICON_CLASS_NAME).show();
                $("#" + errorFieldId).html(errorMessage);
                $("#" + errorFieldId).attr("role", "alert");
                $("#" + errorFieldId).attr("aria-live", "polite");
                $("#" + inputFieldId).addClass(window.INPUT_ERROR_CLASS_NAME);
                $("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("span." + window.ERROR_MESSAGE_LINK_CLASS_NAME).addClass(window.ERROR_QUESTION_CLASS_NAME);
                ($("#" + inputFieldId).is(":input"))
					? $("#" + inputFieldId).attr("aria-invalid", true)
					: $("#" + inputFieldId).find(":input").attr("aria-invalid", true);
            } else {
                $("#" + errorFieldId).removeAttr("role");
                $("#" + errorFieldId).hide();
                $("#" + errorFieldId).siblings("." + window.ERROR_MESSAGE_ICON_CLASS_NAME).hide();
                $("#" + inputFieldId).removeClass(window.INPUT_ERROR_CLASS_NAME);
                $("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("span." + window.ERROR_MESSAGE_LINK_CLASS_NAME).removeClass(window.ERROR_QUESTION_CLASS_NAME);
                ($("#" + inputFieldId).is(":input"))
					? $("#" + inputFieldId).attr("aria-invalid", false)
					: $("#" + inputFieldId).find(":input").attr("aria-invalid", false);
            }
        },
        // Clears the validation on the input field.
        resetValidation: function (ignoreValidatingField) {
            var inputFieldId = this.element[0].id;
            $("#" + inputFieldId).data("valid", true);
            $("#" + inputFieldId).data("errorCode", 0);
            $("#" + inputFieldId).data("dirty", false);
            $("#" + inputFieldId).data("mandatory", false);
            if (ignoreValidatingField) {
                $("#" + inputFieldId).data("ignore", true);
            }
            this.hideOrShowMessage(this.options.errorFieldId, inputFieldId, this.options.errorMessage, false);
            this.showSummaryOfErrors(true, inputFieldId, this.options.errorFieldId, "");
        },
        // Returns validated ABN based on ATO's ABN format & rules.
        returnValidABN: function (abn) {
            var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
            // Remove all whitespaces from the ABN.
            abn = abn.replace(/ /g, ""); ;
            // Check length of the ABN is 11 digits long.
            var validABN = false;
            if (abn.length == 11) {
                // Apply ATO check method using the ATO rules & format:
                // https://www.ato.gov.au/Business/Australian-business-number/In-detail/Introduction/Format-of-the-ABN/
                var sum = 0;
                var digit, position;
                $(weights).each(function (index, value) {
                    digit = abn.charAt(index) - (index ? 0 : 1);
                    sum += value * digit;
                });
                validABN = (sum % 89) == 0;
            }
            return validABN;
        },
        returnValidAddressOrName: function (address) {
            var pattern = /.*[^\x00-\x7F]/; // ASCII validation pattern.
            return address.match(pattern) == null ? true : false;
        },
        // Returns validated checkboxes or radio buttons based on a checked checkbox or radio button element.
        returnValidCheckboxesOrRadiobuttonsField: function (inputFieldId, isCheckbox) {
            var selector = (isCheckbox) ? " :checkbox" : " :radio";
            return $("#" + inputFieldId).find(selector).is(":checked");
        },
        // Returns validated contact number that allows international numbers and area code in brackets.
        returnValidContactNumber: function (contactNumber) {
            return contactNumber.length >= 6;
        },
        // Returns validated date format if it is in the correct format as specified.
        returnValidDate: function (date, dateFormat) {
            return (Globalize.parseDate(date, dateFormat) != null) ? true : false;
        },
        // Returns validated date range between two dates given.
        returnValidDateRange: function (dateFrom, dateTo) {
            var validDateRange = true;
            if (dateFrom.length > 0 || dateTo.length > 0) {
                var dateFromSplit = dateFrom.split("/");
                var dateFromFormatted = new Date(dateFromSplit[2], dateFromSplit[1] - 1, dateFromSplit[0]);
                var dateToSplit = dateTo.split("/");
                var dateToFormatted = new Date(dateToSplit[2], dateToSplit[1] - 1, dateToSplit[0]);
                if (dateFromFormatted > dateToFormatted) {
                    validDateRange = false;
                }
            }
            return validDateRange;
        },
        // Returns validated drop-down list based on an item selected.
        returnValidDropdownList: function (dropDownListId) {
            return $("#" + dropDownListId + " option:selected[value='default']").length == 0 ? true : false; ;
        },
        // Returns validated email address based on Ektron's regular expression email pattern.
        returnValidEmailAddress: function (emailAddress) {
            var pattern = /^([A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+(\.[A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+)*@([A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+\.[A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+)*)$/; // Email validation pattern based on Ektron.
            return emailAddress.match(pattern) != null ? true : false;
        },
        // Returns validated number only format. Useful for currency.
        returnValidNumber: function (number) {
            var pattern = /(^([0-9]+)$)/;
            return number.match(pattern) != null ? true : false;
        },
        // Returns validated number range between two numbers given.
        returnValidNumberRange: function (smallerNumber, largerNumber) {
            return (parseInt(smallerNumber) <= parseInt(largerNumber));
        },
        // Returns validated other checkbox or radio button if it is checked based on the other input text field.
        returnValidOtherCheckboxOrRadiobuttonField: function (inputFieldId, isCheckbox) {
            var selector = (isCheckbox) ? " :checkbox" : " :radio";
            var dataAttributeKey = (isCheckbox) ? window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME : window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME;
            var otherCheckboxOrRadiobuttonField = $("#" + inputFieldId).getCheckboxOrRadiobuttonField(selector, dataAttributeKey);
            return otherCheckboxOrRadiobuttonField.is(":checked");
        },
        // Returns validated other input text field based on the other checkbox or radio button.
        returnValidOtherInputField: function (inputFieldId, isCheckbox) {
            var selector = (isCheckbox) ? " :checkbox" : " :radio";
            var dataAttributeKey = (isCheckbox) ? window.OTHER_CHECKBOX_ID_ATTRIBUTE_NAME : window.OTHER_RADIOBUTTON_ID_ATTRIBUTE_NAME;
            var otherCheckboxOrRadiobuttonField = $("#" + inputFieldId).getCheckboxOrRadiobuttonField(selector, dataAttributeKey);
            return $("input").filterByAttributeValue(dataAttributeKey, otherCheckboxOrRadiobuttonField.attr("id")).data("valid");
        },
        // Returns validated phone mumber for Australia based phone number, area code + 8 digit number or mobile number.
        returnValidPhoneNumber: function (phoneNumber) {
            var pattern = /(^([0-9]{10})$)/;
            return phoneNumber.match(pattern) != null ? true : false;
        },
        // Returns validated postcode for Australia based postcode format (4 digits).
        returnValidPostcode: function (postCode) {
            var pattern = /(^([0-9]{4})$)/;
            return postCode.match(pattern) != null ? true : false;
        },
        // Returns validated secondment start date.
        returnValidSecondmentStartDate: function (secondmentStartDate) {
            var validSecondmentStartDate = true;
            if (secondmentStartDate.length > 0) {
                var secondmentStartDateSplit = secondmentStartDate.split("/");
                var secondmentStartDateFormatted = new Date(secondmentStartDateSplit[2], secondmentStartDateSplit[1] - 1, secondmentStartDateSplit[0]);
                var minimumSecondmentStartDateSplit = window.MINIMUM_SECONDMENT_START_DATE.split("/");
                var minimumSecondmentStartDate = new Date(minimumSecondmentStartDateSplit[2], minimumSecondmentStartDateSplit[1] - 1, minimumSecondmentStartDateSplit[0]);
                if (secondmentStartDateFormatted < minimumSecondmentStartDate) {
                    validSecondmentStartDate = false;
                }
            }
            return validSecondmentStartDate;
        },
        // Sets the error code to the dependent fields.
        setDependentFieldsErrorCode: function (inputField, isValid, textFieldOptions) {
            if (isValid == true
            && textFieldOptions.dependentRangeId.length > 0
            && textFieldOptions.secondDependentRangeId.length > 0) {
                $(inputField).data("errorCode", textFieldValidation.errorCode);
            }
        },
        // Displays summary of errors messages to the user.
        showSummaryOfErrors: function (isValid, inputFieldId, errorFieldId, errorMessageSummaryText) {
            var errorMessageId = inputFieldId + "ErrorSummary";
            if (isValid) {
                // Clear the default error message text then hide if it is valid.
                $("." + errorMessageId).parent("li").remove();
                if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " li a").length == 0) {
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).empty();
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).hide();
                }
            } else {
                // Create the summary of the error message.
                var errorMessageSummaryLink = ($("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("." + window.ERROR_MESSAGE_SUMMARY_LINK_CLASS_NAME).length > 0)
                                                ? $.trim($("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("." + window.ERROR_MESSAGE_SUMMARY_LINK_CLASS_NAME).first().html())
                                                : $.trim($("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("." + window.ERROR_MESSAGE_LINK_CLASS_NAME).first().html());
                //var errorMessageSummaryLink = $.trim($("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).find("." + window.ERROR_MESSAGE_LINK_CLASS_NAME).first().html());
                var errorMessage = "<a class='" + errorMessageId + "' href='#" + inputFieldId + "'>" + errorMessageSummaryLink + "</a>&nbsp;<span class='" + window.ERROR_MESSAGE_SUMMARY_TEXT_CLASS_NAME + "'>" + errorMessageSummaryText + "</span>";
                if ($("." + errorMessageId).length == 0) {
                    // Create the div for the error message summary if it is not in the form content page.
                    if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).length == 0) {
                        // If the default location of the error message summary is not defined it will be created after '.danger' div element.
                        $("<div class='" + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " error'></div>").insertAfter(window.LOCATION_OF_ERROR_MESSAGE_SUMMARY);
                    }
                    // Add the ARIA screen reader attributes only for the first error message summary text otherwise if there is more than one 
                    // instance it will read out multiple times.
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().attr("aria-live", "polite");
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().attr("aria-relevant", "text additions");
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().attr("role", "alert");
                    // Add the default error message text first.
                    if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " li a").length == 0) {
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).append('<img class="icon" src="/uploadedImages/Content/images/error.png" alt="Error" />');
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).append("<p class='" + window.DEFAULT_ERROR_MESSAGE_SUMMARY_CLASS_NAME + "'>" + window.DEFAULT_ERROR_SUMMARY_TEXT + "</p>");
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).append("<" + ERROR_MESSAGE_SUMMARY_LIST_TYPE + ">");
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " " + window.ERROR_MESSAGE_SUMMARY_LIST_TYPE).first().attr("aria-labelledby", "errorTitle");
                    }
                    // Now add the error message text following the default message text.
                    // Check the summary of the error message if it exists.
                    if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " li a").length > 0
                        && $("#" + errorFieldId).data("index") < $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " a").returnMaxDataValue("index")) {
                        // Loop through each summary of error messages to insert the error message especially especially if there is more than one summary displayed.
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).each(function () {
                            // Loop through the existing summary of error messages and insert the error message based on the DOM position order of the individual error messages.
                            $(this).find("li a").each(function () {
                                if ($(this).data("index") > $("#" + errorFieldId).data("index")) {
                                    $(this).parent("li").before("<li>" + errorMessage + "</li>");
                                    return false;
                                }
                            });
                        });
                    } else {
                        // Add the error message to the error message summary container.
                        $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME + " " + ERROR_MESSAGE_SUMMARY_LIST_TYPE).append("<li>" + errorMessage + "</li>");
                    }
                    $("." + errorMessageId).data("index", $("#" + errorFieldId).data("index"));
                    // Set on click event handler to focus on the input field for the error message (hyperlink).
                    $(document).on("click", "." + errorMessageId, function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if ($("#" + inputFieldId).is(":hidden")) {
                            $("#" + inputFieldId).parents("." + window.HIDE_EXPAND_CLASS_NAME).slideDown("slow");
                        }
                        if ($("#" + inputFieldId).find(":checkbox").length > 0) {
                            $("#" + inputFieldId).find(":checkbox").first().focus();
                        } else if ($("#" + inputFieldId).find(":radio").length > 0) {
                            $("#" + inputFieldId).find(":radio").first().focus();
                        } else {
                            $("#" + inputFieldId).focus();
                        }
                        // Sroll to the top of the input field since iOS devcies does not scroll into view for checkboxes.
                        window.scrollTo(0, Validation.scrollToPositionForMobile($("#" + inputFieldId).parents("." + window.WRAPPER_CLASS_NAME).offset().top));
                    });
                    $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).show();
                } else {
                    // Update the existing error message summary. No need to re-create a new one.
                    var index = $("." + errorMessageId).data("index");
                    $("." + errorMessageId).parent("li").html(errorMessage);
                    $("." + errorMessageId).data("index", index);
                }
            }
            // Update the text for the default error message summary showing the included count of errors.
            var numberErrors = $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().find("li a").length;
            var errorMessageCount = numberErrors + " error needs";
            if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().find("li a").length > 1) {
                errorMessageCount = numberErrors + " errors need";
            }
            var updatedErrorMessageText = window.DEFAULT_ERROR_SUMMARY_TEXT.replace(/\[\ErrorMessageCount\]+/g, errorMessageCount);
            $("." + window.DEFAULT_ERROR_MESSAGE_SUMMARY_CLASS_NAME).html(updatedErrorMessageText);
        },
        // A handler to validate input field elements. An error message will be displayed next to the input field element and in the error message summary.
        validateField: function (inputFieldId, inputFieldOptions, overwriteShowSummaryOfError, validationRuleIndex) {
            var errorCode = VALID_FIELD,
                inputFieldValidation,
                isValid,
                errorMessageSummaryText,
                currentValidationType,
                currentErrorMessage;
            switch (validationRuleIndex) {
                case 1:
                    currentValidationType = inputFieldOptions.secondValidationType;
                    currentErrorMessage = inputFieldOptions.secondErrorMessage;
                    break;
                case 2:
                    currentValidationType = inputFieldOptions.thirdValidationType;
                    currentErrorMessage = inputFieldOptions.thirdErrorMessage;
                    break;
                case 3:
                    currentValidationType = inputFieldOptions.fourthValidationType;
                    currentErrorMessage = inputFieldOptions.fourthErrorMessage;
                    break;
                default:
                    currentValidationType = inputFieldOptions.validationType;
                    currentErrorMessage = inputFieldOptions.errorMessage;
            }
            //TODO: The condition of verify inputfield exist is not needed as the verification is already conducted before this can be called.
            if ($("#" + inputFieldId).length != 0) {
                if ($("#" + inputFieldId).is(":text") || $("#" + inputFieldId).is("textArea")) {
                    // Validate the input text field.
                    if ($.trim($("#" + inputFieldId).val()).length > 0) {
                        // This list determines the types of validation.
                        switch (currentValidationType) {
                            case "abn":
                                isValid = this.returnValidABN($("#" + inputFieldId).val());
                                break;
                            case "address":
                                isValid = this.returnValidAddressOrName($("#" + inputFieldId).val());
                                break;
                            case "contactnumber":
                                isValid = this.returnValidContactNumber($("#" + inputFieldId).val());
                                break;
                            case "date":
                                isValid = this.returnValidDate($("#" + inputFieldId).val(), window.DATE_FORMAT_DD_MM_YYYY);
                                break;
                            case "daterange":
                                var dateFrom = (inputFieldOptions.dependentRangeType == "from")
											       ? $("#" + inputFieldId).val()
											       : $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.dependentRangeId, false).val();
                                var dateTo = (inputFieldOptions.dependentRangeType == "to")
											     ? $("#" + inputFieldId).val()
											     : $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.dependentRangeId, false).val();
                                if (this.returnValidDate(dateFrom, window.DATE_FORMAT_DD_MM_YYYY) && this.returnValidDate(dateTo, window.DATE_FORMAT_DD_MM_YYYY)) {
                                    isValid = this.returnValidDateRange(dateFrom, dateTo);
                                } else {
                                    return { isValid: true, errorCode: VALID_FIELD };
                                }
                                break;
                            case "email":
                                isValid = this.returnValidEmailAddress($("#" + inputFieldId).val());
                                break;
                            case "name":
                                isValid = this.returnValidAddressOrName($("#" + inputFieldId).val());
                                break;
                            case "number":
                                var numberToValidate = $("#" + inputFieldId).val().replace(/,/g, "");
                                isValid = this.returnValidNumber(numberToValidate);
                                break;
                            case "numberrange":
                                //A handler to perform the validation for number ranges.
                                function returnValidNumberRangeHandle(me, isSecondaryDependent) {
                                    var numbers = (me.returnSmallAndLargerNumber(inputFieldId, inputFieldOptions, isSecondaryDependent));
                                    if (me.returnValidNumber(numbers.smallerNumber) && me.returnValidNumber(numbers.largerNumber)) {
                                        isValid = me.returnValidNumberRange(numbers.smallerNumber, numbers.largerNumber);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                                if ($("#" + inputFieldId).data("errorCode") != VALID_ALL_DEPENDENT_RANGE_FIELD
                                    && $("#" + inputFieldId).data("errorCode") != VALID_DEPENDENT_RANGE_FIELD
                                    && (inputFieldOptions.dependentRangeType.length > 0
                                    && inputFieldOptions.secondDependentRangeType.length > 0)) {

                                    if (returnValidNumberRangeHandle(this, false)) {
                                        if (!isValid && inputFieldOptions.secondDependentRangeType.length > 0) {
                                            if (returnValidNumberRangeHandle(this, true)) {
                                                if (isValid) {
                                                    errorCode = VALID_ALL_DEPENDENT_RANGE_FIELD;
                                                }
                                            } else {
                                                return { isValid: true, errorCode: VALID_ALL_DEPENDENT_RANGE_FIELD }
                                            }
                                        } else {
                                            return { isValid: true, errorCode: VALID_ALL_DEPENDENT_RANGE_FIELD }
                                        }
                                    } else {
                                        return { isValid: true, errorCode: VALID_ALL_DEPENDENT_RANGE_FIELD }
                                    }
                                } else {
                                    if ($("#" + inputFieldId).data("errorCode") != VALID_DEPENDENT_RANGE_FIELD
                                        && inputFieldOptions.dependentRangeId.length > 0) {

                                        if (returnValidNumberRangeHandle(this, false)) {
                                            if (isValid) {
                                                if (inputFieldOptions.secondDependentRangeType.length > 0) {
                                                    return { isValid: true, errorCode: VALID_DEPENDENT_RANGE_FIELD }
                                                } else {
                                                    errorCode = VALID_DEPENDENT_RANGE_FIELD;
                                                }
                                            }
                                        } else {
                                            return { isValid: true, errorCode: VALID_DEPENDENT_RANGE_FIELD }
                                        }
                                    }
                                    if ((inputFieldOptions.dependentRangeId.length == 0
                                        && inputFieldOptions.secondDependentRangeType.length > 0)
                                        || (isValid == undefined &&
                                        inputFieldOptions.dependentRangeId.length > 0
                                        && inputFieldOptions.secondDependentRangeType.length > 0)) {
                                        if (!returnValidNumberRangeHandle(this, true)) {
                                            return { isValid: true, errorCode: VALID_DEPENDENT_RANGE_FIELD }
                                        }
                                    }
                                }
                                break;
                            case "phonenumber":
                                isValid = this.returnValidPhoneNumber($("#" + inputFieldId).val());
                                break;
                            case "postcode":
                                isValid = this.returnValidPostcode($("#" + inputFieldId).val());
                                break;
                            case "secondmentstartdate":
                                isValid = this.returnValidSecondmentStartDate($("#" + inputFieldId).val());
                                break;
                            case "textonly":
                                isValid = true;
                                break;
                            default:
                        }
                        // Hide or show the error message depending if the input field is valid.
                        if (!isValid) {
                            // Error message does not need to be displayed if it is already shown.
                            if (this.checkErrorMessageExists(inputFieldId, inputFieldOptions.errorFieldId, currentErrorMessage)) {
                                return { isValid: false, errorCode: INVALID_NON_MANDATORY_FIELD };
                            }
                            this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, currentErrorMessage, true);
                            errorCode = INVALID_NON_MANDATORY_FIELD;
                        } else {
                            this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, currentErrorMessage, false);
                        }
                    } else {
                        var isEmptyInputFields,
                            checkMandatoryField = true;
                        if (inputFieldOptions.dependentMandatoryFieldId == inputFieldId
                        && inputFieldOptions.dependentMandatoryErrorMessage.length > 0
                        && inputFieldOptions.validateDependentMandatoryFields) {
                            // Display the dependent mandatory error message if required.
                            isEmptyInputFields = $(this).emptyInputTextFields(inputFieldOptions.dependentGroupId);
                            if (isEmptyInputFields) {
                                if (this.checkErrorMessageExists(inputFieldId, inputFieldOptions.errorFieldId, inputFieldOptions.dependentMandatoryErrorMessage)) {
                                    $("#" + inputFieldId).addClass(window.INPUT_ERROR_CLASS_NAME);
                                    return { isValid: false, errorCode: INVALID_DEPENDENT_MANDATORY_FIELD };
                                }
                                this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.dependentMandatoryErrorMessage, true);
                                isValid = false;
                                errorCode = INVALID_DEPENDENT_MANDATORY_FIELD;
                                checkMandatoryField = false;
                            }
                        } else if (inputFieldOptions.dependentMandatoryErrorMessage.length == 0
                        && inputFieldOptions.dependentGroupId.length > 0) {
                            // Do not diplay the error message if the dependent group is not mandatory.
                            isEmptyInputFields = $(this).emptyInputTextFields(inputFieldOptions.dependentGroupId);
                            if (isEmptyInputFields) {
                                this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.mandatoryMessage, false);
                                isValid = true;
                                errorCode = VALID_FIELD;
                                checkMandatoryField = false;
                            }
                        }
                        if (checkMandatoryField) {
                            // Display error message for mandatory fields if it is not part of a dependent group that is mandatory.
                            if (inputFieldOptions.mandatoryMessage.length > 0) {
                                if (this.checkErrorMessageExists(inputFieldId, inputFieldOptions.errorFieldId, inputFieldOptions.mandatoryMessage)) {
                                    return { isValid: false, errorCode: INVALID_NON_MANDATORY_FIELD };
                                }
                                // Display a messge to user for empty mandatory field.
                                this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.mandatoryMessage, true);
                                isValid = false;
                                errorCode = INVALID_MANDATORY_FIELD;
                            } else {
                                // Do not display a message to user for empty non-mandatory field.
                                this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.mandatoryMessage, false);
                                isValid = true;
                            }
                        }
                    }
                    if (!isValid) {
                        // Prepare the error message text for the error message summary text.
                        if ($("#" + inputFieldId).val().length > 0) {
                            errorMessageSummaryText = currentErrorMessage;
                        } else {
                            errorMessageSummaryText = ($("#" + inputFieldOptions.dependentMandatoryFieldId).length > 0
                            && errorCode == INVALID_DEPENDENT_MANDATORY_FIELD)
                            ? inputFieldOptions.dependentMandatoryErrorMessage
                            : errorMessageSummaryText = inputFieldOptions.mandatoryMessage;
                        }
                    }
                } else if ($("#" + inputFieldId + " :checkbox").length > 0
                || ($("#" + inputFieldId + " :radio").length > 0)) {
                    // Validate checkboxes or radio buttons.
                    var isCheckboxes = ($("#" + inputFieldId + " :checkbox").length > 0) ? true : false;
                    isValid = this.returnValidCheckboxesOrRadiobuttonsField(inputFieldId, isCheckboxes);
                    var isOtherChecboxOrRabioButtonChecked = this.returnValidOtherCheckboxOrRadiobuttonField(inputFieldId, isCheckboxes);
                    if (isOtherChecboxOrRabioButtonChecked) {
                        var isValidOtherInputField = this.returnValidOtherInputField(inputFieldId, isCheckboxes);
                    }
                    if (!isValid) {
                        // Display error message to user if the mandatory field is empty.
                        this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId + " ." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME, inputFieldOptions.mandatoryMessage, true);
                        errorMessageSummaryText = inputFieldOptions.mandatoryMessage;
                    } else {
                        // Hide error message to user if the mandatory field is empty.
                        if (isOtherChecboxOrRabioButtonChecked) {
                            if (isValidOtherInputField || isValidOtherInputField == undefined) {
                                this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId + " ." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME, inputFieldOptions.mandatoryMessage, false);
                            } else {
                                $("#" + inputFieldId + " ." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME).removeClass("." + window.INPUT_ERROR_CLASS_NAME);
                            }
                        } else {
                            this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId + " ." + window.RADIOBUTTON_OR_CHECKBOX_LIST_CLASS_NAME, inputFieldOptions.mandatoryMessage, false);
                        }
                    }
                } else if ($("#" + inputFieldId).has("option").length == 1) {
                    // Validate drop-down list.
                    isValid = this.returnValidDropdownList(inputFieldId);
                    if (!isValid) {
                        this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.mandatoryMessage, true);
                        errorMessageSummaryText = inputFieldOptions.mandatoryMessage;
                    } else {
                        this.hideOrShowMessage(inputFieldOptions.errorFieldId, inputFieldId, inputFieldOptions.mandatoryMessage, false);
                        $("#" + inputFieldId + " option[value='default']").remove();
                    }
                }
                // Display summary of error message to the user.
                var showSummaryError = (inputFieldOptions.showErrorSummaryText) ? overwriteShowSummaryOfError : false
                if (showSummaryError) {
                    this.showSummaryOfErrors(isValid, inputFieldId, inputFieldOptions.errorFieldId, errorMessageSummaryText);
                }
                return { isValid: isValid, errorCode: errorCode };
            }
        },
        // Validates the other input fields if part of a group.
        validateOtherFieldsHandle: function (inputFieldId, dependentGroupId, showSummaryOfError) {
            if ($("#" + inputFieldId).data("valid") == true) {
                var otherInputFields = $("input:text").getOtherInputFieldGroup(inputFieldId, dependentGroupId);
                $(otherInputFields).each(function () {
                    $(this).trigger("validate", [showSummaryOfError, false]);
                });
            }
        },
        returnSmallAndLargerNumber: function (inputFieldId, inputFieldOptions, isSecondaryDependent) {
            var smallerNumber = ((isSecondaryDependent)
                                    ? inputFieldOptions.secondDependentRangeType == "smaller"
                                    : inputFieldOptions.dependentRangeType == "smaller")
                                        ? $("#" + inputFieldId).val().replace(/,/g, "")
                                        : ((isSecondaryDependent)
                                            ? $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.secondDependentRangeId, true).val().replace(/,/g, "")
                                            : $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.dependentRangeId, false).val().replace(/,/g, ""))
            var largerNumber = ((isSecondaryDependent)
                                    ? inputFieldOptions.secondDependentRangeType == "larger"
                                    : inputFieldOptions.dependentRangeType == "larger")
                                        ? $("#" + inputFieldId).val().replace(/,/g, "")
                                        : ((isSecondaryDependent)
                                            ? $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.secondDependentRangeId, true).val().replace(/,/g, "")
                                            : $("input:text").getOtherInputDependentField(inputFieldId, inputFieldOptions.dependentRangeId, false).val().replace(/,/g, ""))
            return { smallerNumber: smallerNumber, largerNumber: largerNumber };
        }
    });
});

var Validation = {
    // Set an index for all the error messages.
    setIndexToErrorMessages: function () {
        $("." + window.ERROR_MESSAGE_CLASS_NAME).each(function (index) {
            $(this).data("index", index);
        });
    },
    // Determine scroll position for mobile view.
    scrollToPositionForMobile: function (scrollToPosition) {
        if ($(window).width() < MOBILE_VIEW_WIDTH) {
            // Scroll the page further down so it is not blocked by the ATO menu bar in mobile view.
            scrollToPosition = scrollToPosition - SCROLL_INTO_MOBILE_VIEW_OFFSET;
        }
        return scrollToPosition;
    },
    // Updates indexes to the error message summary list.
    updateSummaryMessageIndexes: function (elementAddedOrRemoved, isAdded) {
        var errorMessageSummaryField = $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().find("li a").filter(function () {
            return $(this).data("index") >= $("." + window.ERROR_MESSAGE_CLASS_NAME).index($(elementAddedOrRemoved).find("." + window.ERROR_MESSAGE_CLASS_NAME));
        });
        var updatedIndex;
        $(errorMessageSummaryField).each(function () {
            var updatedIndex = (isAdded)
                            ? $(this).data("index") + $(elementAddedOrRemoved).find("." + window.ERROR_MESSAGE_CLASS_NAME).length
                            : $(this).data("index") - $(elementAddedOrRemoved).find("." + window.ERROR_MESSAGE_CLASS_NAME).length;
            $(this).data("index", updatedIndex);
        });
    },
    // Validates all fields with a class ".validate" on the form.
    validateForm: function (validateSection) {
        var isValidForm = true,
            invalidInputFieldId;
        // Only validate fields that have the ".validate" class.
        validateSection = (validateSection == undefined
                            || validateSection == null
                            || validateSection == "")
                                ? "*"
                                : validateSection;
        $(validateSection).find("." + VALIDATE_FIELD_CLASS_NAME).each(function () {
            if ($(this).data("ignore") == false
            || $(this).data("ignore") == undefined
            || $(this).data("ignore") == null) {
                if ($(this).is(":text") || $(this).is("textArea")) {
                    $(this).data("dirty", true);
                }
                // Validate the input fields
                if ($(this).data("errorCode") != INVALID_DEPENDENT_MANDATORY_FIELD) {
                    if ($("input:text").getDependentMandatoryField($(this).data("atoValidate") != undefined ? $(this).validate("option").dependentGroupId : "").length > 0) {
                        $(this).trigger("validate", [true, true]);
                    }
                    else {
                        $(this).trigger("validate", [true, false]);
                    }
                }
                if ($(this).data("valid") != undefined) {
                    if ($(this).data("valid") == false
                        || $(this).data("valid").isValid == false) {
                        if (isValidForm) {
                            isValidForm = false;
                            invalidInputFieldId = this.id;
                        }
                        if ($(this).is(":hidden") && $(this).parents("." + window.HIDE_EXPAND_CLASS_NAME).length > 0) {
                            $(this).parents("." + window.HIDE_EXPAND_CLASS_NAME).slideDown("slow");
                        }
                    }
                }
            }
        });
        if (!isValidForm) {
            if ($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().find("li a").length > 0 && validateSection == "*") {
                window.scrollTo(0, Validation.scrollToPositionForMobile($("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).offset().top));
                // Set the focus to the summary of the error messages for ARIA accessibility.
                $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().click(); // Set focus to the summary of error message so screen readers can read the list of errors.
                $("." + window.ERROR_MESSAGE_SUMMARY_CLASS_NAME).first().find("li a").first().focus();
            } else {
                window.scrollTo(0, Validation.scrollToPositionForMobile($("#" + invalidInputFieldId).parents("." + window.WRAPPER_CLASS_NAME).offset().top));
                $("#" + invalidInputFieldId).focus();
            }
        }
        return isValidForm;
    }
}