import {component} from 'jquery-ts-components';

@component('NativeValidation')
export default class NativeValidation
{
    private $element: JQuery;
    private $form: JQuery;
    private $submit: JQuery;
    private form: HTMLFormElement;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement)
    {
        this.$element = $(element);
        this.$form = this.$element.is('form') ? this.$element : this.$element.closest('form');
        this.form = this.$form[0] as HTMLFormElement;

        if (this.$element.is(':submit')) {
            this.$submit = this.$element;
        } else {
            this.$submit = this.$element.find(':submit');
        }

        if (typeof this.form.checkValidity !== 'function') {
            return;
        }

        if (!this.$element.is(':submit')) {
            this.$form.on('submit', this.preventSubmissionOnSubmitInvalid.bind(this));
        }

        this.$form.on('input', this.hideErrorsOnInput.bind(this));
        this.$submit.on('click', this.onSubmit.bind(this));
        this.form.addEventListener('invalid', this.suppressNativeBubblesOnInvalid, true);
    }

    private suppressNativeBubblesOnInvalid(event: Event)
    {
        event.preventDefault();
    }

    private preventSubmissionOnSubmitInvalid(event: JQueryEventObject)
    {
        if (!this.form.checkValidity()) {
            event.preventDefault();
        }
    }

    private onSubmit(event: JQueryEventObject)
    {
        if (this.form.checkValidity()) {
            return;
        }

        event.preventDefault();
        const $invalidFields = this.$form.find(':invalid');
        this.$form.find('.form-errors').remove();
        $invalidFields.each((index, field) => this.renderErrors($(field)));
        $invalidFields.first().focus();
    }

    private hideErrorsOnInput(event: JQueryEventObject)
    {
        const $field = $(event.target);
        const $container = $field.parent().hasClass('input-group') ? $field.parent() : $field;
        $container
            .removeClass('has-error')
            .next('.form-errors').remove();
    }

    private renderErrors($field: JQuery)
    {
        const $container = $field.parent().hasClass('input-group') ? $field.parent() : $field;
        const message = $field.data('validationMessage') || $field.prop('validationMessage');
        $container
            .addClass('has-error')
            .after(`<ul class="form-errors"><li>${message}</li></ul>`);
    }
}
