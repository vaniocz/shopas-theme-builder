declare namespace JQueryDragtable
{
    interface Table
    {
        el: JQuery;
        selectedHandle: JQuery;
        movingRow: JQuery;
        sortOrder: object;
        startIndex: number;
        endIndex: number;
    }

    interface Options
    {
        dragHandle?: JQuery|HTMLElement|string,
        dragaccept?: string,
        revert?: boolean,
        maxMovingRows?: number,
        excludeFooter?: boolean,
        onlyHeaderThreshold?: number,
        persistState?: ((originalTable: Table) => void)|string;
        restoreState?: ((originalTable: Table) => void)|string;
        exact?: boolean,
        clickDelay?: number,
        containment?: any,
        cursor?: string,
        cursorAt?: JQuery|HTMLElement|string,
        distance?: number,
        tolerance?: string,
        axis?: string,
        beforeStart?: (originalTable: Table) => void;
        beforeMoving?: (originalTable: Table, sortableTable: Table) => void;
        beforeReorganize?: (originalTable: Table, sortableTable: Table) => void;
        beforeStop?: (originalTable: Table) => void;
    }
}

interface JQuery
{
    dragtable(options?: JQueryDragtable.Options): JQuery;
}
