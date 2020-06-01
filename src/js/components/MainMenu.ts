import {component} from 'jquery-ts-components';

@component('MainMenu')
export default class MainMenu
{
    private $element: JQuery;
    private $firstLevelItems: JQuery;

    public constructor(element: JQuery|JQuery.Selector|HTMLElement)
    {
        this.$element = $(element);
        this.$firstLevelItems = this.$element.find('.main-menu__categories--level-1, .main-menu__submenu--level-1');
        this.updateViewportClasses();
        $(window).resize(this.updateViewportClasses.bind(this));
    }

    private updateViewportClasses(): void
    {
        const viewportWidth = $(window).width()!;
        this.$firstLevelItems.each((index: number, element: HTMLElement) => {
            const $element = $(element);
            $element.parent().toggleClass(
                'is-exceeding-viewport',
                $element.width()! > (viewportWidth - $element.parent().offset()!.left)
            );
        });
    }
}
