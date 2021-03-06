const fs = require('fs');
const path = require('path');
const glob = require('glob');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');

const components = require('./styleguide.components');

const PRODUCTION = process.env.NODE_ENV === 'production';

const PACKAGES_WITH_DEFAULT_EXPORT = [
    'ffe-chart-donut-react',
    'ffe-checkbox-react',
    'ffe-dropdown-react',
    'ffe-file-upload-react',
    'ffe-searchable-dropdown-react',
    'ffe-spinner-react',
    'ffe-tables-react',
];

const ignore = [
    '**/__tests__/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/Base*.js',
    '**/InlineBase*.js',
];

module.exports = {
    title: 'SpareBank 1 Designsystem',
    require: [
        'babel-polyfill',
        path.join(__dirname, 'packages/ffe-all.less'),
        path.join(__dirname, 'src/styles/styles.less'),
    ],
    components: 'packages/ffe-*-react/src/**/[A-Z]+([A-Za-z]).js',
    getComponentPathLine(componentPath) {
        /**
         * Matches a starting "packages/", then creates a capture group for whatever is between
         * "packages/" and the next occurence of "/". The goal is to capture the folder name
         * for the package holding the current component.
         */
        const regexpResult = /^packages\/(.+?)\//.exec(
            path.dirname(componentPath),
        );
        if (regexpResult === null) {
            return componentPath;
        }
        const packageName = regexpResult[1];
        const name = path.basename(componentPath, '.js');
        const isDefaultExport = PACKAGES_WITH_DEFAULT_EXPORT.includes(
            packageName,
        );
        if (isDefaultExport) {
            return `import ${name} from '@sb1/${packageName}';`;
        }
        return `import { ${name} } from '@sb1/${packageName}';`;
    },
    ignore,
    styleguideComponents: components,
    styleguideDir: 'dist/styleguidist',
    theme: {
        color: {
            link: '#676767',
            linkHover: '#0071CD',
            sidebarBackground: '#F4F4F4',
            codeBackground: '#F8F5EB',
        },
        fontFamily: {
            base: ['MuseoSans-500', 'arial', 'sans-serif'],
        },
    },
    assetsDir: './static',
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ['babel-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: PRODUCTION
                        ? [
                              MiniCssExtractPlugin.loader,
                              {
                                  loader: 'css-loader',
                                  options: {
                                      minimize: {
                                          autoprefixer: false,
                                      },
                                      url: false,
                                  },
                              },
                              'postcss-loader',
                          ]
                        : [
                              'style-loader',
                              'css-loader?url=false',
                              'postcss-loader',
                          ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.less$/,
                    use: PRODUCTION
                        ? [
                              MiniCssExtractPlugin.loader,
                              {
                                  loader: 'css-loader',
                                  options: {
                                      minimize: {
                                          autoprefixer: false,
                                      },
                                  },
                              },
                              'postcss-loader',
                              'less-loader',
                          ]
                        : [
                              'style-loader',
                              'css-loader',
                              'postcss-loader',
                              'less-loader',
                          ],
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styles.css',
            }),
        ],
    },
    template: ({ css, js, publicPath, title }) => {
        const template = fs.readFileSync(
            path.join(__dirname, 'src', 'styleguidist.html'),
            'utf-8',
        );
        return template
            .replace(
                '<!-- MiniHtmlWebpackPlugin:Title -->',
                `<title>${title}</title>`,
            )
            .replace(
                '<!-- MiniHtmlWebpackPlugin:CSS -->',
                MiniHtmlWebpackPlugin.generateCSSReferences(css, publicPath),
            )
            .replace(
                '<!-- MiniHtmlWebpackPlugin:JS -->',
                MiniHtmlWebpackPlugin.generateJSReferences(js, publicPath),
            );
    },
    sections: [
        {
            name: 'Knapper',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/knapper.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-buttons-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Typografi',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/typografi.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-core-react/src/typography/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Ikoner',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/ikoner.md',
                },
                {
                    name: 'Kode',
                    content: 'packages/ffe-icons-react/src/README.md',
                },
            ],
        },
        {
            name: 'Formatering',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/formatering.md',
                },
                {
                    name: 'Kode',
                    content: 'packages/ffe-formatters/src/README.md',
                },
            ],
        },
        {
            name: 'Lister',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/lister.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-lists-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Diagram',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/diagram.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-chart-donut-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Accordion',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/accordion.md',
                },
                {
                    name: 'Kode',
                    components: () => [
                        'packages/ffe-accordion-react/src/Accordion.js',
                        'packages/ffe-accordion-react/src/BlueAccordion.js',
                    ],
                },
            ],
        },
        {
            name: 'Kontovelger',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/kontovelger.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-account-selector-react/src/components/**/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Kort',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/kort.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-cards-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Meldinger',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/meldinger.md',
                    sections: [
                        {
                            name: 'Meldinger, bokser',
                            content:
                                'styleguide-content/komponenter/meldinger-bokser.md',
                        },
                        {
                            name: 'Meldinger, kontekstuelle',
                            content:
                                'styleguide-content/komponenter/meldinger-kontekstuelle.md',
                        },
                        {
                            name: 'Systemmeldinger',
                            content:
                                'styleguide-content/komponenter/meldinger-system.md',
                        },
                    ],
                },
                {
                    name: 'Kode',
                    sections: [
                        {
                            name: 'Meldinger, bokser',
                            components:
                                'packages/ffe-message-box-react/src/[A-Z]+([A-Za-z]).js',
                        },
                        {
                            name: 'Meldinger, kontekstuelle',
                            components:
                                'packages/ffe-context-message-react/src/Context{Error,Info,Success,Tip}Message.js',
                        },
                        {
                            name: 'Systemmeldinger',
                            components:
                                'packages/ffe-system-message-react/src/System{Error,Info,News,Success}Message.js',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Dropdowns',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/dropdown.md',
                },
                {
                    name: 'Kode',
                    components: () => [
                        'packages/ffe-searchable-dropdown-react/src/SearchableDropdown.js',
                        'packages/ffe-dropdown-react/src/Dropdown.js',
                    ],
                },
            ],
        },
        {
            name: 'Grid',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/grid.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-grid-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Detaljliste',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/detaljliste.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-details-list-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Tabeller',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/tabeller.md',
                },
                {
                    name: 'Kode',
                    components: 'packages/ffe-tables-react/src/Table.js',
                },
            ],
        },
        {
            name: 'Skjemaelementer',
            sections: [
                {
                    name: 'Bruk',
                    content:
                        'styleguide-content/komponenter/skjemaelementer.md',
                },
                {
                    name: 'Kode',
                    components: () => [
                        ...glob.sync(
                            'packages/ffe-form-react/src/[A-Z]+([A-Za-z]).js',
                            { ignore },
                        ),
                        ...glob.sync(
                            'packages/ffe-checkbox-react/src/[A-Z]+([A-Za-z]).js',
                            { ignore },
                        ),
                        ...glob.sync(
                            'packages/ffe-radio-button-react/src/[A-Z]+([A-Za-z]).js',
                            { ignore },
                        ),
                        'packages/ffe-datepicker-react/src/datepicker/Datepicker.js',
                        'packages/ffe-datepicker-react/src/calendar/Calendar.js',
                        ...glob.sync(
                            'packages/ffe-file-upload-react/src/[A-Z]+([A-Za-z]).js',
                            { ignore },
                        ),
                    ],
                },
            ],
        },
        {
            name: 'Spinners',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/spinners.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-spinner-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
        {
            name: 'Faner',
            sections: [
                {
                    name: 'Bruk',
                    content: 'styleguide-content/komponenter/faner.md',
                },
                {
                    name: 'Kode',
                    components:
                        'packages/ffe-tabs-react/src/[A-Z]+([A-Za-z]).js',
                },
            ],
        },
    ],
};
