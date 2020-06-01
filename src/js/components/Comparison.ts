import 'jquery-ui-sortable';
import 'dragtable';
import {component} from 'jquery-ts-components';

(jQuery.fn as any).size = function (this: JQuery) {
    return this.length;
};

@component('Comparison')
export default class Comparison
{
    private $element: JQuery;
    private $table: JQuery;
    private $products: JQuery;
    private $previousButton: JQuery;
    private $nextButton: JQuery;
    private $moveButtons: JQuery;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement)
    {
        this.$element = $(element);
        this.$table = this.$element.find('.comparison__table');
        this.$products = this.$element.find('.comparison__product');
        this.$previousButton = this.$element.find('.comparison__previous-button');
        this.$nextButton = this.$element.find('.comparison__next-button');
        this.$moveButtons = this.$element.find('.comparison__product-move-button');
        this.$previousButton.on('click', this.scrollPrevious.bind(this));
        this.$nextButton.on('click', this.scrollNext.bind(this));
        this.$table.on('scroll', this.renderButtons.bind(this));
        $(window).on('resize scroll', this.renderButtons.bind(this));
        this.$moveButtons.on('click', () => false);
        this.renderButtons();

        if (this.$moveButtons.length) {
            this.$table.dragtable({
                dragHandle: this.$moveButtons,
                dragaccept: '.comparison__product',
                containment: this.$element,
                beforeMoving: this.onBeforeMoving.bind(this),
            });
        }
    }

    private renderButtons(): void
    {
        const scrollLeft = this.$table.scrollLeft()!;
        const scrollWidth = this.$table.prop('scrollWidth');
        const width = this.$table.innerWidth()!;
        const propertyWidth = this.$element.find('.comparison__property-item').innerWidth()!;
        const offset = this.$table.offset()!;
        const top = Math.max(offset.top - window.pageYOffset, 0);
        const topVisibleHeight = window.pageYOffset + $(window).height()! - offset.top;
        const bottom = Math.max(topVisibleHeight - this.$table.height()!, 0);
        const bottomVisibleHeight = $(window).height()! - bottom;
        const previousButtonHeight = this.$previousButton.outerHeight()!;
        const nextButtonHeight = this.$nextButton.outerHeight()!;
        this.$previousButton.add(this.$nextButton).css({top, bottom});

        if (scrollLeft > 0 && previousButtonHeight <= topVisibleHeight && previousButtonHeight <= bottomVisibleHeight) {
            this.$previousButton.removeAttr('disabled');
        } else {
            this.$previousButton.attr('disabled', 'disabled');
        }

        if (
            scrollWidth > width
            && scrollLeft < (scrollWidth - Math.max(width, propertyWidth))
            && nextButtonHeight <= topVisibleHeight
            && nextButtonHeight <= bottomVisibleHeight
        ) {
            this.$nextButton.removeAttr('disabled');
        } else {
            this.$nextButton.attr('disabled', 'disabled');
        }
    }

    private scrollPrevious(): void
    {
        const propertyWidth = this.$element.find('.comparison__property-item').innerWidth()!;
        const position = Math.floor((this.$table.scrollLeft()! - 1) / propertyWidth);
        this.$table.animate({scrollLeft: position * propertyWidth});
    }

    private scrollNext(): void
    {
        const propertyWidth = this.$element.find('.comparison__property-item').innerWidth()!;
        const position = Math.ceil((this.$table.scrollLeft()! + 1) / propertyWidth);
        this.$table.animate({scrollLeft: position * propertyWidth});
    }

    private onBeforeMoving(originalTable: JQueryDragtable.Table, sortableTable: JQueryDragtable.Table): void
    {
        const $moveButton = sortableTable.el.find(`> li:nth-child(${originalTable.startIndex}) .comparison__product-move-button`);
        sortableTable.el.sortable('option', 'update', (event: JQuery.TriggeredEvent, ui: JQueryUI.SortableUIParams) => {
            this.update($moveButton.attr('href')!, ui.item.index() - 1);
        });
    }

    private update(url: string, position: number): void
    {
        $.post(url, {position});
    }
}
