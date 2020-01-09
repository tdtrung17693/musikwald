const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const filter = require('gulp-filter');
const clean = require('gulp-clean');
const fs = require('fs');
const cheerio = require('cheerio');
const ts = require('typescript');
const rimraf = require('rimraf');
const svgSprite = require('gulp-svg-sprite');

const CLIENT_APP_PATH = './resources/assets/app/';
const CLIENT_ICONS_PATH = './resources/assets/assets/icons/';
const COMMON_CLIENT_PATH = './resources/assets/shared/';
const NODE_MODULES_PATH = './node_modules/';
const CUSTOM_ICONS_PATHS = ['./resources/assets/assets/icons/individual/*.svg', COMMON_CLIENT_PATH + 'assets/icons/*.svg'];

function extractTranslationsFromTsFiles() {
    const files = getFilesInPath(CLIENT_APP_PATH, '.ts');
    const props = ['be-modal', 'toast'];
    let lines = [];

    files.forEach(function(path) {
        // don't need to parse spec or module files
        if (path.indexOf('.spec') > -1 || path.indexOf('.module') > -1) return;

        // create ts source file
        const tsFile = ts.createSourceFile(path, fs.readFileSync(path, 'utf8'), null, false);

        // find all function call expressions in ts file
        const nodes = _findNodes(tsFile, ts.SyntaxKind.CallExpression, tsFile);

        nodes.forEach(function(node) {
            // function (method) name
            const methodAccess = node.getChildAt(0);

            // class name for above function
            const propAccess = node.getChildAt(0).getChildAt(0);

            // check that the class is "modal" or "toast" and function name is "show"
            if (!propAccess || !propAccess.name || props.indexOf(propAccess.name.text) === -1) return;
            if (!methodAccess || !methodAccess.name || methodAccess.name.text !== 'show') return;

            // toast call will have translatable string as first argument.
            // modal call will have translatable strings in an object as second argument.
            const argIndex = propAccess.name.text === 'toast' ? 0 : 1;
            const keys = _extractTranslationsStringsFromFunctionCallExpression(node, argIndex);

            if (keys && keys.length) {
                lines = lines.concat(keys);
            }
        });
    });

    return lines.filter(function(item, pos, self) {
        return self.indexOf(item) === pos;
    });
};

/**
 * Get strings from function call's first argument
 */
function _extractTranslationsStringsFromFunctionCallExpression(callNode, argIndex) {
    if (!callNode.arguments.length) return;

    const argument = callNode.arguments[argIndex];

    if (!argument) return;

    switch (argument.kind) {
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.FirstTemplateToken:
        return [argument.text];
    case ts.SyntaxKind.ObjectLiteralExpression:
        return argument.properties.filter(function(prop) {
            return prop && prop.initializer &&
                prop.initializer.kind === ts.SyntaxKind.StringLiteral &&
                prop.initializer.text;
        }).map(function(prop) {
            return prop.initializer.text;
        });
    }
}

/**
 * Find all child nodes of a kind
 */
function _findNodes(node, kind, source) {
    const childrenNodes = node.getChildren(source);
    const initialValue = node.kind === kind ? [node] : [];

    return childrenNodes.reduce(function(result, childNode) {
        return result.concat(_findNodes(childNode, kind, source));
    }, initialValue);
}

gulp.task('i18n-extract', function() {
    const files = getFilesInPath(CLIENT_APP_PATH, '.html');
    const fromHtml = {};

    files.forEach(function(path) {
        const $ = cheerio.load(fs.readFileSync(path, 'utf8'));

        $('[trans], [trans-placeholder], [trans-title], [itemsName], [tooltip], [matTooltip]').each(function(i, el) {
            const $el = $(el); let text;

            // extract input placeholder attribute
            if ($el.attr('placeholder') && $el.attr('placeholder').length) {
                text = $el.attr('placeholder');
            }

            // extract node title attribute
            else if ($el.attr('trans-title') && $el.attr('trans-title').length) {
                text = $el.attr('title');
            }

            // extract custom "itemsName" attribute
            else if ($el.attr('itemsname') && $el.attr('itemsname').length) {
                text = $el.attr('itemsname');
            }

            // extract custom "tooltip" attribute
            else if ($el.attr('tooltip') && $el.attr('tooltip').length) {
                text = $el.attr('tooltip');
            }

            // extract custom "matTooltip" attribute
            else if ($el.attr('matTooltip') && $el.attr('matTooltip').length) {
                text = $el.attr('matTooltip');
            }

            // extract node text content
            else {
                text = $el.text();
            }

            const key = text.trim();
            fromHtml[key] = key;
        });
    });

    const fromTs = extractTranslationsFromTsFiles();

    // concat lines extracted from html and ts files
    fromTs.forEach(function(key) {
        if (!fromHtml[key]) {
            fromHtml[key] = key;
        }
    });

    // remove "dynamic" lines
    Object.keys(fromHtml).forEach((key) => {
        if ((key.indexOf('{{') > -1 && key.indexOf('}}') > -1)) {
            delete fromHtml[key];
        }
    });

    fs.writeFile('./../server/resources/client-translations.json', JSON.stringify(fromHtml), 'utf8');
});

gulp.task('dist', function(completeAsync) {
    // remove old dist files from laravel public folder
    // gulp.src('./../server/public/client', {read: false}).pipe(clean({force: true}));

    const $ = cheerio.load(fs.readFileSync('./public/client/index.html', 'utf8'));

    // get script tags that need to be injected into main laravel view
    const scripts = $('script').map(function(i, el) {
        return $('<div>').append($(el)).html();
    }).toArray();

    // get css tags that need to be injected into main laravel view
    const styles = $('link').filter(function(i, el) {
        return $(el).attr('href').indexOf('client/styles.') > -1;
    }).map(function(i, el) {
        return $('<div>').append($(el)).html();
    }).toArray();

    // js scripts replace regex
    const jsSearch = /{{--angular scripts begin--}}[\s\S]*{{--angular scripts end--}}/;
    const jsReplaceStr = '{{--angular scripts begin--}}' + '\n\t\t' + scripts.join('\n\t\t') + '\n\t{{--angular scripts end--}}';

    // css styles replace regex
    const cssSearch = /{{--angular styles begin--}}[\s\S]*{{--angular styles end--}}/;
    const cssReplaceStr = '{{--angular styles begin--}}' + '\n\t\t' + styles.join('\n\t\t') + '\n\t{{--angular styles end--}}';

    const laravelViewPath = './resources/views/app.blade.php';

    // replace app stylesheet links and js script tags with new ones
    let content = fs.readFileSync(laravelViewPath, 'utf8');
    content = content.replace(jsSearch, jsReplaceStr).replace(cssSearch, cssReplaceStr);

    fs.writeFileSync(laravelViewPath, content, 'utf8');

    completeAsync();
});

// Compile svg icons into a single file
gulp.task('svgstore', function(completeAsync) {
    const iconNames = getIconNames();

    const PATHS = CUSTOM_ICONS_PATHS.slice();
    PATHS.push(NODE_MODULES_PATH + 'material-design-icons/*/svg/production/*_24px.svg');

    gulp.src(PATHS)

        // filter out svg icons that are not used in project
        .pipe(filter(function(file) {
            return iconNames.indexOf(normalizeIconName(file.path)) > -1;
        }))

        // normalize icon names
        .pipe(rename(function(file) {
            file.basename = normalizeIconName(file.basename);
        }))

        // compile, minify and store svg on disk.
        .pipe(svgmin())
        // .pipe(svgstore())
        .pipe(svgSprite({
            shape: {
                id: {
                    generator: function(name, file) {
                        const parts = name.split('/');
                        return parts[parts.length - 1].replace('.svg', '');
                    },
                },
            },
            mode: {
                defs: true,
                inline: true,
            },
        }))
        .pipe(rename('merged.svg'))
        .pipe(gulp.dest(CLIENT_ICONS_PATH));
    completeAsync();
});

/**
 * Normalize custom icons names by replacing underscore and
 * white space with dash and appending '-custom' to file name
 */
gulp.task('normalize-icon-names', function() {
    return gulp.src(CUSTOM_ICONS_PATHS)
        .pipe(clean())
        .pipe(rename(function(file) {
            if (file.basename.indexOf('-custom') === -1) {
                file.basename = file.basename.toLowerCase().replace(/[_\s]/, '-') + '-custom';
            }
        }))
        .pipe(gulp.dest(CLIENT_ICONS_PATH));
});

/**
 * Normalize icon file name.
 * "ic_icon_name_24px.svg" to "icon-name"
 */
function normalizeIconName(path) {
    const filename = path.replace(/^.*[\\\/]/, '');
    return filename.replace('ic_', '').replace('_24px', '').replace(/[_=]/g, '-').replace('.svg', '');
}

/**
 * Extract names of icons that should be included into
 * compiled svg file from project .html files.
 */
function getIconNames() {
    let htmlFiles = getFilesInPath(CLIENT_APP_PATH, '.html');
    htmlFiles = htmlFiles.concat(getFilesInPath(COMMON_CLIENT_PATH, '.html'));

    let names = extractIconNamesFromHtmlFiles(htmlFiles);
    names = names.concat(extractIconNamesFromTsFiles(getFilesInPath(CLIENT_APP_PATH, '.ts')));

    // start icons that are not in html files, but should be included
    names = names.concat([
        'local-offer',
        'new-releases',
        'library-music',
    ]);

    // filter out duplicates from icon names
    return names.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) accum.push(current);
        return accum;
    }, []);
}

function extractIconNamesFromTsFiles(files) {
    let names = [];

    files.forEach(function(path) {
        const contents = fs.readFileSync(path, 'utf8');
        const regex = /icon: '(.+?)'/g;

        let matches; const output = [];
        while (matches = regex.exec(contents)) {
            output.push(matches[1]);
        }

        names = names.concat(output);
    });

    return names;
}

/**
 * Extract all icon names from contents of files
 * in specified files path list.
 */
function extractIconNamesFromHtmlFiles(files) {
    let names = [];

    files.forEach(function(path) {
        const contents = fs.readFileSync(path, 'utf8');
        const regex = /svgIcon="(.+?)"/g;

        let matches; const output = [];
        while (matches = regex.exec(contents)) {
            output.push(matches[1]);
        }

        names = names.concat(output);
    });

    return names;
}

/**
 * get a list of all project's .html file paths.
 */
function getFilesInPath(dir, extension, filelist) {
    if (dir[dir.length - 1] !== '/') dir = dir.concat('/');

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = getFilesInPath(dir + file + '/', extension, filelist);
        } else {
            if (file.indexOf(extension) > -1) {
                filelist.push(dir + file);
            }
        }
    });

    return filelist;
}
