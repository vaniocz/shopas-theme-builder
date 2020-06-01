import {component} from 'jquery-ts-components';

interface ToggleOptions
{
    source: JQuery|JQuery.Selector|HTMLElement;
    target: JQuery|JQuery.Selector|HTMLElement;
    className: string;
}

@component('Toggle')
export default class Toggle
{
    private $source: JQuery;
    private $target: JQuery;
    private options: ToggleOptions;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement, options: ToggleOptions|string)
    {
        this.options = $.extend(
            {className: 'toggle--active', source: element},
            typeof options === 'string' ? {target: options} : options
        );
        this.$source = $(this.options.source);
        this.$target = $(this.options.target);

        if (this.$source.is(':checkbox') || this.$source.is(':radio') || this.$source.is('option')) {
            let $eventTarget;

            if (this.$source.is('option')) {
                $eventTarget = this.$source.closest('select');
            } else if (this.$source.is(':radio') && this.$source.attr('name')) {
                $eventTarget = $(`input[name="${this.$source.attr('name')}"]`);
            } else {
                $eventTarget = this.$source;
            }

            $eventTarget.on('change', this.toggleClass.bind(this));
            this.toggleClass();
        } else {
            this.$source.on('click', (event: JQuery.TriggeredEvent) => {
                event.preventDefault();
                this.$target.toggleClass(this.options.className);
            });
        }
    }

    private toggleClass(): void
    {
        this.$target.toggleClass(this.options.className, this.$source.is(':checked'))
    }
}
