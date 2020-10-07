var SmollSPA = {
    title: '',          // original document title
    titles: {},         // path => page title
    paths: {},          // path => element
    links: [],          // list of elements
    activeClass: {},    // path => class list
};

SmollSPA.display = function() {
    SmollSPA.hideAllPaths();
    var path = window.location.pathname;
    if(path in SmollSPA.paths) {
        SmollSPA.showPath(path);
    } else if('404' in SmollSPA.paths) {
        SmollSPA.showPath('404')
    } else {
        console.error('Path not found! ', path);
    }
    SmollSPA.deactivateAll();
    SmollSPA.activateLink(path);
};

SmollSPA.hideAllPaths = function() {
    for(var path in SmollSPA.paths) {
        var element = SmollSPA.paths[path];
        element.style.display = 'none';
    }
};

SmollSPA.showPath = function(path, display = 'block') {
    var element = SmollSPA.paths[path];
    element.style.display = display;
    var title = path in SmollSPA.titles ? SmollSPA.titles[path] : path.replace('/', ' ');
    document.title = SmollSPA.title + ' | ' + title;
};

SmollSPA.getLink = function(search_path) {
    var self = window.location.protocol + '//' + window.location.host;
    for(var link of SmollSPA.links) {
        var path = link.href.replace(self, '');
        if(path === search_path) return link;
    }
    return null;
};

SmollSPA.activateLink = function(active_path) {
    var link = SmollSPA.getLink(active_path);
    for(var className of SmollSPA.activeClass[active_path]) 
        link.classList.add(className);
};

SmollSPA.deactivateAll = function() {
    var self = window.location.protocol + '//' + window.location.host;
    for(var link of SmollSPA.links) {
        var path = link.href.replace(self, '');
        for(var className of SmollSPA.activeClass[path])
            link.classList.remove(className);
    }
};

SmollSPA.addClickEvent = function(element) {
    element.addEventListener('click', function(e) {
        var self = window.location.protocol + '//' + window.location.host;
        if(element.href.startsWith(self)) {
            e.preventDefault();
            window.history.pushState(null, null, element.href);
            SmollSPA.display();
        }
    });
};

SmollSPA.initialize = function() {

    SmollSPA.title = document.title;

    for(var element of document.querySelectorAll('*')) {

        if(element.hasAttribute('href')) {
            var self = window.location.protocol + '//' + window.location.host;
            var path = element.href.replace(self, '');
            SmollSPA.addClickEvent(element);
            if(element.hasAttribute('SmollSPAActiveClass')) {
                var classString = element.getAttribute('SmollSPAActiveClass');
                var classList = classString.split(' ').filter(function(x) {return x.length > 0;});
                SmollSPA.activeClass[path] = classList;
                SmollSPA.links.push(element);
            }
            if(element.hasAttribute('SmollSPATitle')) {
                SmollSPA.titles[path] = element.getAttribute('SmollSPATitle');
            }
        }

        else if (element.hasAttribute('SmollSPAMatch')) 
            SmollSPA.paths[element.getAttribute('SmollSPAMatch')] = element;
    }

    // Display matching path content
    SmollSPA.display();

};

document.addEventListener('DOMContentLoaded', SmollSPA.initialize);
window.addEventListener('popstate', SmollSPA.display);
