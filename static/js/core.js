/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const projectsContainer = 'projects-container';
const tasksContainer = 'tasks-container';

function createTagElement(tagname, cls='', id='', extraData=''){
    var ele = document.createElement(tagname);
    if (cls.length) {ele.className = cls;}
    if (id.length) {ele.id = id;}
    if (extraData.length) {
        extraData = JSON.parse(extraData);
        for(var data in extraData){
            if (~data.indexOf('data')){
                ele.dataset[data.substr(5)] = extraData[data];
            } else {
                ele[data] = extraData[data];
            }
        }
    }
    return ele;
}

function getTargetContainer(id){
    var targetContainer = document.getElementById(id);
    targetContainer.innerHTML = '';
    return targetContainer;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function createProjectItem(id, url, name, color){
    var el = createTagElement('li','row');
    var projContainer = createTagElement('div', 'col-10 row');
    var projBadge = createTagElement('div', 'poject-badge','','{"style":"backgrond-color:'+color+'"}');
    projContainer.appendChild(projBadge);
    var projLink = createTagElement('a', 'project-tasks','','{"href":"#"}');
    projLink.dataset['url'] = url;
    projLink.innerHTML = name;
    projContainer.appendChild(projLink);
    var menuContainer = createTagElement('div', 'col-2 dropright');
    var menuButton = createTagElement('button', 'btn dropdown-toggle-split', '', '{"data-toggle":"dropdown", "aria-haspopup":"true" "aria-expanded":"false"}');
    var icon = createTagElement('i','fas fa-ellipsis-v');
    menuButton.appendChild(icon);
    menuContainer.appendChild(menuButton);
    el.appendChild(projContainer);
    el.appendChild(menuContainer);
    return el;
}

function createProjectsList(data){
    var parentContainer = getTargetContainer(projectsContainer);
    
}