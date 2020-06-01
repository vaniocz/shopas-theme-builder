import {component} from 'jquery-ts-components';

@component('NumberInput')
export default class NumberInput
{
    private $element: JQuery;
    private $input: JQuery;
    private $decrement: JQuery;
    private $increment: JQuery;
    private timeout: any;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement)
    {
        this.$element = $(element);
        this.$input = this.$element.find('.number-input__input');
        this.$decrement = this.$element.find('.number-input__decrement');
        this.$increment = this.$element.find('.number-input__increment');
        $(document).on('mouseup', this.onMouseUp.bind(this));
        this.$decrement.on('mousedown', this.onMouseDown.bind(this));
        this.$increment.on('mousedown', this.onMouseDown.bind(this));
        this.$element.on('wheel', this.onWheel.bind(this));
        this.$input.on('change', this.render.bind(this));
        this.render();
    }

    public get value(): number
    {
        const value = this.$input.val();

        return value === '' ? NaN : Number(value);
    }

    public get min(): number
    {
        const min = Number(this.$input.attr('min'));

        return isNaN(min) ? -Infinity : min;
    }

    public get max(): number
    {
        const max = Number(this.$input.attr('max'));

        return isNaN(max) ? Infinity : max;
    }

    public get step(): number
    {
        return Number(this.$input.attr('step')) || 1;
    }

    public get isValid(): boolean
    {
        return isNaN(this.value) || this.value > this.max || this.value < this.min
    }

    public decrement(): void
    {
        if (this.value - this.step >= this.min) {
            this.$input.val(this.value - this.step);
            this.$input.trigger('change');
        }
    }

    public increment(): void
    {
        if (this.value + this.step <= this.max) {
            this.$input.val(this.value + this.step);
            this.$input.trigger('change');
        }
    }

    private onMouseUp(): void
    {
        clearTimeout(this.timeout);
        clearInterval(this.timeout);
    }

    private onMouseDown(event: JQuery.TriggeredEvent): void
    {
        const handler = $(event.target).is(this.$decrement) ? this.decrement.bind(this) : this.increment.bind(this);
        handler();
        this.timeout = setTimeout(() => {
            handler();
            this.timeout = setInterval(handler, 100);
        }, 500);
    }

    private onWheel(event: JQuery.TriggeredEvent): void
    {
        const originalEvent = event.originalEvent as MouseWheelEvent;
        event.preventDefault();

        if (originalEvent.deltaY > 0) {
            this.decrement();
        } else {
            this.increment();
        }
    }

    private render(): void
    {
        this.$element
            .toggleClass('has-error', this.isValid)
            .toggleClass('number-input--max', this.value >= this.max)
            .toggleClass('number-input--min', this.value <= this.min);
    }
}
