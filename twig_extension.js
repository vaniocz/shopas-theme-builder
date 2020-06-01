const Twig = require('twig');
const fixtures = require(`./src/fixtures.json`);

function htmlNumberFormat(number, unit, precision) {
    if (precision == null && typeof number === 'string') {
        const position = number.lastIndexOf('.');

        if (position !== -1) {
            precision = number.length - position - 1;
        }
    }

    if (precision != null) {
        number = Number(number).toFixed(precision);
    }

    let [string, decimals] = number.toString().split('.');

    if (!decimals) {
        decimals = '';
    }

    const decimalsLength = decimals.length;
    const isZerofill = Number(decimals) == 0;
    decimals = decimals.replace(/0+$/, '<span class="number-format__zero-padding">$&</span>');

    return `<span class="number-format">${string.replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="number-format__thousands-separator"></span>')}<span class="number-format__decimals ${isZerofill ? 'number-format__decimals--zerofill' : ''}" data-decimals-length="${decimalsLength}"><span class="number-format__decimals-separator">${decimals ? '.' : ''}</span>${decimals}</span>${unit ? `<span class="number-format__unit">${unit}</span>` : ''}</span>`;
}

function slug(text) {
    let from = 'ąàáäâãåæăćčĉďęèéëêěĝĥìíïîĵłľńňòóöőôõðøřśșşšŝťțţŭùúüűûůñÿýçżźž';
    let to = 'aaaaaaaaacccdeeeeeeghiiiijllnnoooooooorssssstttuuuuuuunyyczzz';
    from += from.toUpperCase();
    from += 'ß';
    to += to.toUpperCase();
    to = to.split('');
    to.push('ss');
    let slug = text.toLowerCase();

    slug = slug.replace(/.{1}/g, (character) => {
        const index = from.indexOf(character);

        return index === -1 ? character : to[index];
    });

    slug = slug.replace(/[^a-z0-9]+/g, '-');
    slug = slug.replace(/^\-+|\-+$/g, '');

    return slug;
}

exports.default = () => {
    Twig.extendFilter('html_number_format', (value, args) => htmlNumberFormat(value, ...args));
    Twig.extendFunction('slug', slug);
    Twig.extendFunction('fixtures', () => fixtures);
};
