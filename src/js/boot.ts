import {register} from 'jquery-ts-components';

if (process.env.NODE_ENV === 'development') {
    addEventListener('message', onDevServerReady);
} else {
    $(() => register(document.body));
}

function onDevServerReady(event: MessageEvent): void
{
    if (event.data.type === 'webpackOk') {
        removeEventListener('message', onDevServerReady);
        register(document.body);
    }
}
