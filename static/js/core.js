/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const projectsContainer = 'projects';
const tasksContainer = 'tasks';

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

function createProjectItem(id, url, name, color, tasks, done, have_burning){

    var el = createTagElement('li',' list-group-item custom-list-group-item');
    var outerContainer = createTagElement('div','row align-items-center', 'proj-'+id)

    var badgeContainer = createTagElement('div', 'col-1');
    var projBadge = createTagElement('div', 'project-badge','','{"style":"background-color:'+color+'"}');
    badgeContainer.appendChild(projBadge);

    var projContainer = createTagElement('div', 'col-9');
    var projLink = createTagElement('a', 'project-tasks','','{"href":"#"}');
    projLink.dataset['url'] = url;
    projLink.dataset['method'] = 'get';
    projLink.dataset['projectid'] = 'proj-'+id;
    projLink.innerHTML = name;
    projContainer.appendChild(projLink);

    var cntContainer = createTagElement('div', 'col-1');
    var cnt = createTagElement('span', 'tasks-cnt');
    cnt.innerText = done+'/'+tasks
    if (done==tasks && done) {cnt.className += ' doned';}
    if (have_burning) {cnt.className += ' burning';}
    cntContainer.appendChild(cnt);


    var menuContainer = createTagElement('div', 'col-1 row dropright');
    var menuButton = createTagElement('button', 'btn dropdown-toggle-split', '', '{"data-toggle":"dropdown", "aria-haspopup":"true", "aria-expanded":"false"}');
    var icon = createTagElement('i','fas fa-ellipsis-v');
    menuButton.appendChild(icon);
    menuContainer.appendChild(menuButton);
    var container = createTagElement('div', 'dropdown-menu');
    var button = createTagElement('button', 'btn btn-secondary prevented project-edit', '', '{"href":"#", "innerText":"Edit"}');
    button.dataset['url'] = url;
    button.dataset['method']='put';
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented project-delete', '', '{"href":"#", "innerText":"Delete"}');
    button.dataset['url'] = url;
    button.dataset['method']='delete';
    container.appendChild(button);
    menuContainer.appendChild(container);
    outerContainer.appendChild(badgeContainer);
    outerContainer.appendChild(projContainer);
    outerContainer.appendChild(cntContainer);
    outerContainer.appendChild(menuContainer);
    el.appendChild(outerContainer);
    return el;
}

function createProjectsList(data){
    projects = data;
    var parentContainer = getTargetContainer(projectsContainer);
    var container = createTagElement('ul', 'list-group list-group-flush col');
    data.forEach(function(item){
        var tasks = item.task
        var tasks_cnt = tasks.length;
        var done_cnt = 0;
        var have_burning = false;
        tasks.forEach(function(task){
            var now = new Date();
            var deadline = new Date(task.deadline);
            if(task.is_done) {done_cnt ++;}
            if(deadline < now && !task.is_done) {have_burning=true;}
        });
        var pr = createProjectItem(item.id, item.url, item.name, item.color, tasks_cnt, done_cnt, have_burning);
        container.appendChild(pr);
    });
    parentContainer.appendChild(container);
}

function getAllProjects(){
    $.ajax({
        url: 'projects/',
        type: 'get',
        dataType: 'json',
        success: createProjectsList
    });
}

function createTaskItem(task){
    COLORS = {"0":"red", "1":"orange", "2":"white"}
    var outerContainer = createTagElement('div', 'col-11 offset-sm-1 row align-items-center all-tasks-container');
    var container = createTagElement('div','col-11 row align-items-center');
    outerContainer.className += task.option;

    var taskBadgeContainer = createTagElement('div', 'col-1');
    var color = COLORS[task.priority];
    var taskBadge = createTagElement('div', 'task-badge','','{"style":"background-color:'+color+'"}')
    taskBadgeContainer.appendChild(taskBadge);
    container.appendChild(taskBadgeContainer);

    var taskTitleContainer = createTagElement('div', 'col-8');
    var taskTitle = createTagElement('p','task-title');
    taskTitle.innerText = task.title;
    var taskDeadline = createTagElement('p','task-deadline');
    var ddl = new Date(task.deadline);
    var now = new Date();
    var timeleft = ddl - now;
    if (timeleft < 0 || timeleft < (24*3600)){
        taskDeadline.className += ' burning'
    } else if ((24*3600) <= timeleft < (48*3600)){
        taskDeadline.className += ' warning'
    }
    taskDeadline.innerText = ddl.toLocaleString('ru');
    taskTitleContainer.appendChild(taskTitle);
    taskTitleContainer.appendChild(taskDeadline);
    container.appendChild(taskTitleContainer);

    var projectContainer = createTagElement('div', 'col-3 row align-items-center');
    var projectBadgeContainer = createTagElement('div', 'col-3 tasks-project');
    var projBadge = createTagElement('div', 'project-badge-small','','{"style":"background-color:'+task.project.color+'"}');
    projectBadgeContainer.appendChild(projBadge);

    var projectLinkContainer = createTagElement('div', 'col-9 tasks-project');
    var projectLink = createTagElement('a', 'project-tasks','','{"href":"#"}');
    projectLink.dataset['url'] = task.project.url;
    projectLink.dataset['method'] = 'get';
    projectLink.dataset['projectid'] = 'proj-'+task.project.id;
    projectLink.innerHTML = task.project.name;
    projectLinkContainer.appendChild(projectLink);

    projectContainer.appendChild(projectLinkContainer);
    projectContainer.appendChild(projectBadgeContainer);
    container.appendChild(projectContainer);

    outerContainer.appendChild(container);

    var menuContainer = createTagElement('div', 'col-1 row dropright');
    var menuButton = createTagElement('button', 'btn dropdown-toggle-split', '', '{"data-toggle":"dropdown", "aria-haspopup":"true", "aria-expanded":"false"}');
    menuButton.className += task.option;

    var icon = createTagElement('i','fas fa-ellipsis-v');
    menuButton.appendChild(icon);
    menuContainer.appendChild(menuButton);
    var container = createTagElement('div', 'dropdown-menu');
    var button = createTagElement('button', 'btn btn-secondary prevented task-done', '', '{"href":"#", "innerText":"Done"}');
    button.dataset['url'] = task.url;
    button.dataset['method']='put';
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented task-edit', '', '{"href":"#", "innerText":"Edit"}');
    button.dataset['url'] = task.url;
    button.dataset['method']='put';
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented task-delete', '', '{"href":"#", "innerText":"Delete"}');
    button.dataset['url'] = task.url;
    button.dataset['method']='delete';
    container.appendChild(button);
    menuContainer.appendChild(container);
    outerContainer.appendChild(menuContainer);

    return outerContainer;
}

function createTasksList(data, heading){
    var parentContainer = getTargetContainer(tasksContainer);
    var container = createTagElement('div', 'col-12');

    title = createTagElement('h2','all-tasks-title ');
    title.innerHTML = heading;

    container.appendChild(title);
    parentContainer.appendChild(container);

    data.forEach(function(item){
        var tr = createTaskItem(item);
        container.appendChild(tr);
    });
    parentContainer.appendChild(container);
}

function prepareTasks(tasks){
    var burning = [];
    var normal = [];
    var finished = [];
    tasks.forEach(function(task){
        var ddl = new Date(task.deadline);
        var now = new Date();
        if(ddl < now && !task.is_done) {
            task['option'] = ' burning'
            burning.push(task);
        } else if (task.is_done) {
            task['option'] = ' disabled'
            finished.push(task);
        } else {
            task['option'] = ' normal'
            normal.push(task);
        }

    });
    return burning.concat(normal, finished);
}

function tasksListCallback(data){
    var res = prepareTasks(data);
    createTasksList(res, "Today's tasks");
}

function weeklyTasksListCallback(data){
    var res = prepareTasks(data);
    createTasksList(res, "Tasks for next 7 days");
}

function finishedTasksListCallback(data){
    var res = prepareTasks(data);
    createTasksList(res, "Finished tasks");
}

function burningTasksListCallback(data){
    var res = prepareTasks(data);
    createTasksList(res, "Burning tasks");
}

function projectTasksListCallback(data){
    var res = prepareTasks(data.task);
    title = res[0].project.name
    createTasksList(res, title+" tasks");
}

function getTaskCreationForm(url){

    priorities = [['0','HI'],['1','NORMAL'],['2','LOW']];

    var parentContainer = getTargetContainer('tasks');
    var container = createTagElement('div', 'col-10 offset-sm-1 form-group')
    var input = createTagElement('input', 'form-control','title-input','{"name":"title-input", "type":"text", "placeholder":"Title"}');
    container.appendChild(input);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col-10 offset-sm-1 form-group')
    var input = createTagElement('select','form-control','project-input','{"name":"project-input"}');
    var label = createTagElement('label','form-check-label','','{"for":"project-input", "innerText": "Project"}');
    projects.forEach(function(project){
        var option = createTagElement('option');
        option.value = project.id;
        option.innerText = project.name;
        input.appendChild(option);
    });
    container.appendChild(input);
    container.appendChild(label);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col-10 offset-sm-1 form-group')
    var input = createTagElement('select','form-control','priority-input','{"name":"priority-input"}');
    var label = createTagElement('label','form-check-label','','{"for":"priority-input", "innerText": "Priority"}');
    priorities.forEach(function(prio){
        var option = createTagElement('option');
        option.value = prio[0];
        option.innerText = prio[1];
        input.appendChild(option);
    });
    container.appendChild(input);
    container.appendChild(label);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col-10 offset-sm-1 form-group')
    var input = createTagElement('input', 'form-control','date-input','{"name":"date-input", "type":"datetime"}');
    container.appendChild(input);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col-10 offset-sm-1 form-group')
    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"CREATE"}');
    button.dataset['url'] = url;
    button.addEventListener('click', createTask);
    container.appendChild(button);
    parentContainer.appendChild(container);

}

function getTodayTasks(){
    $.ajax({
        url: 'projects/tasks/daily/',
        type: 'get',
        dataType: 'json',
        success: tasksListCallback
    });
}

function getWeeklyTasks(){
    $.ajax({
        url: 'projects/tasks/weekly/',
        type: 'get',
        dataType: 'json',
        success: weeklyTasksListCallback
    });
}

function getFinishedTasks(){
    $.ajax({
        url: 'projects/tasks/finished/',
        type: 'get',
        dataType: 'json',
        success: finishedTasksListCallback
    });
}

function getBurningTasks(){
    $.ajax({
        url: 'projects/tasks/burning/',
        type: 'get',
        dataType: 'json',
        success: burningTasksListCallback
    });
}

function getProjectTasks(e){
    var url = e.currentTarget.dataset['url'];
    $.ajax({
        url: url,
        type:'GET',
        dataType:'json',
        success: projectTasksListCallback
    });
}

function createTask(e){
    var url = e.currentTarget.dataset['url'];
    var d = document.getElementById('date-input').value;
    d_o = new Date(d);

    var dt = d_o.toJSON().toString();
    var data = {
        title: document.getElementById('title-input').value,
        project: parseInt(document.getElementById('project-input').value),
        priority: document.getElementById('priority-input').value,
        is_done: false,
        deadline: dt,
    }
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: 'POST',
        dataType: 'json', // Set datatype - affects Accept header
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
        },
        success: function(data){
            getAllProjects();
            getTodayTasks();
        },
    });
}
