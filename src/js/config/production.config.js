let productionRoot = 'http://www.joelotter.com/kajero/dist/';  //Modify with actual url root for the production resources
productionRoot = 'src/dist/'; //Remove this
module.exports = {
    kajeroHomepage: 'http://www.joelotter.com/kajero/',
    gistUrl: 'https://gist.githubusercontent.com/anonymous/',
    gistApi: 'https://api.github.com/gists',
    cssUrl: productionRoot+'main.css', 
    scriptUrl: productionRoot+'bundle.js',
    notebookMode: ''
}
