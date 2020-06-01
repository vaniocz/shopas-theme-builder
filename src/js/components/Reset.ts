import {component} from 'jquery-ts-components';

interface ResetOptions
{
    target?: JQuery|JQuery.Selector|HTMLElement;
    submit?: boolean;
}

@component('Reset')
export default class Reset
{
    private $element: JQuery;
    private $target: JQuery;
    private options: ResetOptions = {};
    private initialValue: string;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement, options: ResetOptions|string)
    {
        this.$element = $(element);

        if (typeof options === 'string') {
            this.$target = $(options);
        } else {
            this.$target = $(options.target!);
            this.options = options;
        }

        this.render();
        this.$target.on('input', this.render.bind(this));
        this.$element.on('click', this.reset.bind(this));
        this.initialValue = this.$target.attr('value') || '';
    }

    private render(): void
    {
        this.$element.toggleClass('is-hidden', this.$target.val() === '');
    }

    private reset(): void
    {
        this.$target.val('');
        this.render();

        if (this.options.submit && this.$target.val() !== this.initialValue) {
            this.$element.closest('form').submit();
        }
    }
}
