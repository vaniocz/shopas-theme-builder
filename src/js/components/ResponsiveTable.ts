import {component} from 'jquery-ts-components';

interface ColumnLabel
{
    offsetFrom: number;
    offsetTo: number;
    label: string;
}

@component('ResponsiveTable')
export default class ResponsiveTable
{
    private $element: JQuery;
    private labels: ColumnLabel[] = [];

    public constructor(element: JQuery|JQuery.Selector|HTMLElement) {
        this.$element = $(element);
        let offsetFrom = 0;

        this.$element.find('> thead > tr:first > th').each((index: number, th: HTMLElement) => {
            const $th = $(th);
            const colspan = Number($th.attr('colspan')) || 1;
            const offsetTo = offsetFrom + colspan - 1;
            this.labels.push({
                offsetFrom,
                offsetTo,
                label: $th.text().trim(),
            });
            offsetFrom = offsetTo + 1;
        });

        this.renderLabels();
    }

    private renderLabels(): void
    {
        this.$element.find('> tbody > tr').each((index: number, tr: HTMLElement) => {
            let offsetFrom = 0;
            let labelsOffset = 0;

            $(tr).find('> td').each((index: number, td: HTMLElement) => {
                const $td = $(td);
                const colspan = Number($td.attr('colspan')) || 1;
                const offsetTo = offsetFrom + colspan - 1;

                if (!$td.hasClass('desktop-only') && !$td.is(':empty')) {
                    let labels: string[] = [];

                    for (let label of this.labels) {
                        if (label.offsetFrom < labelsOffset) {
                            continue;
                        }

                        if (
                            (offsetFrom >= label.offsetFrom && offsetFrom <= label.offsetTo)
                            || (offsetTo >= label.offsetFrom && offsetTo <= label.offsetTo)
                        ) {
                            labels.push(label.label);
                            labelsOffset = label.offsetTo + 1;
                        }
                    }

                    $td.attr('data-label', labels.join(', '));
                }

                offsetFrom = offsetTo + 1;
            });
        });
    }
}
