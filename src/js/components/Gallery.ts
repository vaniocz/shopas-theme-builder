import {component} from 'jquery-ts-components';

@component('Gallery')
export default class Gallery
{
    private $element: JQuery;
    private $image: JQuery;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement)
    {
        this.$element = $(element);
        this.$image = this.$element.find('.gallery__image');
        this.$element.on('click', '.gallery__thumbnail', this.onThumbnailClick.bind(this));
    }

    private onThumbnailClick(event: JQuery.TriggeredEvent): void
    {
        event.preventDefault();
        this.$element.find('.gallery__thumbnail.is-active').removeClass('is-active');
        const $thumbnail = $(event.currentTarget);
        const $link = $thumbnail.find('.gallery__thumbnail-link');
        $thumbnail.addClass('is-active');
        this.$image.attr('src', $link.attr('href')!);

        if ($link.data('size')) {
            const size = $link.data('size')!.split('x');
            this.$image
                .css({maxWidth: `${size[0]}px`, maxHeight: `${size[1]}px`})
                .toggleClass('gallery__image--landscape', size[0] > size[1])
                .toggleClass('gallery__image--portrait', size[0] < size[1]);
        }
    }
}
