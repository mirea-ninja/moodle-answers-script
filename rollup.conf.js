const path = require('path');
const userscript = require('rollup-plugin-userscript');
const pkg = require('./package.json');

const FILENAME = 'answers-script';

const bundleOptions = {
    extend: true,
    esModule: false,
};

const rollupConfig = [
    {
        input: {
            input: 'src/index.js',
            plugins: [
                userscript(
                    path.resolve('src/meta.js'),
                    meta => meta
                        .replace('process.env.NAME', pkg.name)
                        .replace('process.env.DESCRIPTION', pkg.description)
                        .replace('process.env.VERSION', pkg.version)
                        .replace('process.env.AUTHOR', pkg.author),
                ),
            ],
        },
        output: {
            format: 'iife',
            file: `${FILENAME}.user.js`,
            ...bundleOptions,
        },
    },
    {
        input: {
            input: 'src/meta.js',
            plugins: [
                userscript(
                    path.resolve('src/meta.js'),
                    meta => meta
                        .replace('process.env.NAME', pkg.name)
                        .replace('process.env.DESCRIPTION', pkg.description)
                        .replace('process.env.VERSION', pkg.version)
                        .replace('process.env.AUTHOR', pkg.author),
                ),
            ],
        },
        output: {
            file: `${FILENAME}.meta.js`
        },
    },
];

rollupConfig.forEach((item) => {
    item.output = {
        indent: false,
        externalLiveBindings: false,
        ...item.output,
    };
});

module.exports = rollupConfig.map(({ input, output }) => ({
    ...input,
    output,
}));
