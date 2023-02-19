$(document).ready(function () {
    InitialiseJavascriptPrototypeFunctions();
    InitialiseJqueryExtendFunctions();
});

// Javascript protyope functions.
function InitialiseJavascriptPrototypeFunctions() {
    // Returns the maximum value in an array.
    Array.prototype.max = function () {
        return Math.max.apply(Math, this);
    };

    // Returns the minimum value in an array.
    Array.prototype.min = function () {
        return Math.min.apply(Math, this);
    };
}

// JQuery extend functions.
function InitialiseJqueryExtendFunctions() {
    // Returns true if the set of input fields is empty.
    $.fn.emptyInputTextFields = function (dependentGroupId) {
        // Find all input fields that is part of the dependent group Id.
        var inputFieldsGroup = $("input:text").filter(function () {
            return $(this).data("validate") != undefined
            ? $(this).validate("option").dependentGroupId == dependentGroupId
            : "";
        });
        // Check if the input fields are empty.
        var numberOfEmptyInputFields = inputFieldsGroup.filter(function () {
            return $.trim(this.value).length == 0;
        }).length;
        return (numberOfEmptyInputFields == inputFieldsGroup.length) ? true : false;
    }

    // Returns a filtered list of elements that contain a specified attribute name.
    $.fn.filterByAttributeName = function (attributeName) {
        return this.filter(
        function () {
            return $(this).attr(attributeName) != undefined;
        });
    }

    // Returns a filtered list of elements that contain a specified attribute name matching an attribute value.
    $.fn.filterByAttributeValue = function (attributeName, attributeValue) {
        return this.filter(
        function () {
            return $(this).attr(attributeName) == attributeValue;
        });
    }

    // Returns the matching checkbox or radio button field based on the input text field.
    $.fn.getCheckboxOrRadiobuttonField = function (selector, dataAttributeKey) {
        var otherCheckboxOrRadiobuttonField = $("#" + $(this).attr("id") + selector).filter(function () {
            return this.id == $("input").filterByAttributeValue(dataAttributeKey, this.id).attr(dataAttributeKey);
        });
        return otherCheckboxOrRadiobuttonField;
    },

    // Returns the mandatory field that is part of a dependent group of input field elements.
    $.fn.getDependentMandatoryField = function (dependentGroupId) {
        return $(this).filter(function () {
            return $(this).data("validate") != undefined
            ? ($(this).validate("option").dependentGroupId == dependentGroupId
            && $(this).validate("option").dependentMandatoryFieldId.length > 0)
            : "";
        });
    }

    // Returns a filtered list of elements that is invalid as part of a dependent group.
    $.fn.getInvalidInputFieldGroup = function (dependentGroupId) {
        return $(this).getInputFieldGroup(dependentGroupId).filter(function () {
            return $(this).data("valid") == false;
        });
    }

    // Returns a group of elements based on the dependent group fields ID.
    $.fn.getInputFieldGroup = function (dependentGroupId) {
        return $(this).filter(function () {
            return $(this).data("validate") != undefined
            ? $(this).validate("option").dependentGroupId == dependentGroupId
              ? $(this).validate("option").dependentGroupId == dependentGroupId
              : $(this).validate("option").dependentDateRangeId == dependentGroupId
            : "";
        });
    }

    // Returns true if there is a focus on a group of input field elements based on a parent div element.
    $.fn.getInputFieldHasFocus = function (parentDivName) {
        var inputFieldType;
        switch ($(this).attr("type")) {
            case "checkbox":
                inputFieldType = ":checkbox";
                break;
            case "radio":
                inputFieldType = ":radio";
                break;
            default:
        }
        var inputHasFocus = ($(this).parents(parentDivName).find(inputFieldType).filter(function () {
            return this.id == document.activeElement.id;
        }).length > 0) ? true : false;
        return inputHasFocus;
    }

    // Return the set of other input fields that ia part of a dependent group.
    $.fn.getOtherInputFieldGroup = function (inputFieldId, dependentGroupId) {
        var inputFieldsGroup = $(this).getInputFieldGroup(dependentGroupId);
        var otherInputFields = $(inputFieldsGroup).filter(function () {
            return this.id != inputFieldId;
        });
        return otherInputFields;
    }

    // Return the other input date field for grouped date range fields.
    $.fn.getOtherInputDateField = function (inputDateFieldId, dependentDateRangeId) {
        var dependentDateRangeType = $("#" + inputDateFieldId).data("validate") != undefined
                                     ? $("#" + inputDateFieldId).validate("option").dependentDateRangeType
                                     : "";
        return $(this).filter(function () {
            return $(this).data("validate") != undefined
                   ? $(this).validate("option").dependentDateRangeId == dependentDateRangeId
                   && $(this).validate("option").dependentDateRangeType != dependentDateRangeType
                   : ""
        });
    }

    // Returns a filtered list of elements that is valid as part of a dependent group.
    $.fn.getValidInputFieldGroup = function (dependentGroupId) {
        return $(this).getInputFieldGroup(dependentGroupId).filter(function () {
            return $(this).data("valid") == true || $(this).data("valid") == undefined;
        });
    }

    // Returns true if the other set of input text field elements that is part of a group has focus.
    $.fn.inputFieldsGroupHasFocus = function () {
        var inputFieldsGroupHasFocus = false;
        var dependentGroupId = $(this).data("validate") != undefined
                               ? $(this).validate("option").dependentGroupId.length > 0
                                 ? $(this).validate("option").dependentGroupId
                                 : $(this).validate("option").dependentDateRangeId
                               : "";
        if (dependentGroupId.length > 0) {
            var inputFieldsGroup = $("input:text").getInputFieldGroup(dependentGroupId);
            inputFieldsGroupHasFocus = $(inputFieldsGroup).filter(function () {
                return this.id == document.activeElement.id;
            }).length > 0 ? true : false;
        }
        return inputFieldsGroupHasFocus;
    }

    // Returns true if there is a dependent group of input field elements is invalid.
    $.fn.inputFieldsGroupIsInvalid = function (dependentGroupId) {
        return $(this).getInputFieldGroup(dependentGroupId).filter(function () {
            return $(this).data("valid") == false;
        }).length > 0 ? true : false;
    }

    // Returns true if a defined other radio button or checkbox is selected based on the matching attribute defined from the other input text field.
    $.fn.otherCheckboxOrRadioButtonChecked = function (otherInputIdAttributeName) {
        return $("#" + $(this).find(":text").filterByAttributeName(otherInputIdAttributeName).attr(otherInputIdAttributeName)).is(":checked");
    }

    // Returns true if the set of input text field elements that is part of group contains an error.
    $.fn.otherInputFieldsGroupHasError = function () {
        var otherInputFieldHasError = false;
        var inputFieldId = $(this).attr("id");
        var dependentGroupId = $(this).data("validate") != undefined
                               ? $(this).validate("option").dependentGroupId
                               : "";
        if (dependentGroupId.length > 0) {
            var inputFieldsGroup = $("input:text").getInputFieldGroup(dependentGroupId);
            var otherInputFields = $(inputFieldsGroup).filter(function () {
                return this.id != inputFieldId;
            });
            if (otherInputFields.length > 0) {
                otherInputFieldHasError = $(otherInputFields).inputFieldsGroupIsInvalid(dependentGroupId);
            }
        }
        return otherInputFieldHasError;
    }

    // Returns the maximum value contained in an array.
    $.fn.returnMaxDataValue = function (propertyName) {
        var indexArray = [];
        $(this).each(function () {
            indexArray.push($(this).data(propertyName));
        });
        return indexArray.max();
    }
}