var SmollTabs = {
    tabs: {},           // name => element
    activeClass: {},    // name => class list
    init: {},           // function name => function
};

SmollTabs.getTab = function(name, index) {
    return SmollTabs.tabs[name].children[index];
};

SmollTabs.getTabs = function(name) {
    return SmollTabs.tabs[name].children;
};

SmollTabs.hideAll = function(name) {
    var tabs = SmollTabs.getTabs(name);
    for(var tab of tabs)
        tab.style.display = 'none';
};

SmollTabs.show = function(name, index, display = 'block') {
    var tab = SmollTabs.getTab(name, index);
    tab.style.display = display;
};

SmollTabs.getAllClicks = function(name) {
    var result = [];
    for(var element of document.querySelectorAll('*')) {
        if(element.hasAttribute('SmollTabsClick') 
            && element.getAttribute('SmollTabsClick') === name)
            result.push(element);
    }; return result;
};

SmollTabs.activateElement = function(name, index) {
    var tabButtons = SmollTabs.getAllClicks(name);
    for(var className of SmollTabs.activeClass[name])
        tabButtons[index].classList.add(className);
};

SmollTabs.deactivateAll = function(name) {
    for(var element of SmollTabs.getAllClicks(name))
        for(var className of SmollTabs.activeClass[name])
            element.classList.remove(className);
};

SmollTabs.init.initializeTabsContainer = function(element) {

    var name = element.getAttribute('SmollTabs');
    SmollTabs.tabs[name] = element;
    SmollTabs.hideAll(name);
    SmollTabs.show(name, 0);

    // Add tabButton click events
    var tabButtons = SmollTabs.getAllClicks(name);
    for(var i = 0; i < tabButtons.length; i++) {
        SmollTabs.init.addClickEvent(tabButtons[i], name, i);
    }

    // Implement active class on each tabButton
    if(element.hasAttribute('SmollTabsActiveClass')) {
        var classString = element.getAttribute('SmollTabsActiveClass');
        var classList = classString.split(' ').filter(function(x) {return x.length > 0;});
        SmollTabs.activeClass[name] = classList;
        SmollTabs.activateElement(name, 0);
    }
};

SmollTabs.init.addClickEvent = function(element, name, index) {
    element.addEventListener('click', function(e) {
        SmollTabs.hideAll(name);
        SmollTabs.show(name, index);
        if(name in SmollTabs.activeClass) {
            SmollTabs.deactivateAll(name);
            SmollTabs.activateElement(name, index);
        }
    });
};

SmollTabs.initialize = function() {
    for(var element of document.querySelectorAll('*')) {
        if(element.hasAttribute('SmollTabs'))
            SmollTabs.init.initializeTabsContainer(element);
    }
};

document.addEventListener('DOMContentLoaded', SmollTabs.initialize);
