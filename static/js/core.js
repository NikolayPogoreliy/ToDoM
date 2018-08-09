/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const projectsContainer = 'projects';
const tasksContainer = 'tasks';
const COLORS = {"0":"red", "1":"orange", "2":"white"};
const PRIORITIES = [['0','HI'],['1','NORMAL'],['2','LOW']];
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
    var projBadge = createTagElement('div', 'project-badge','project-color-'+id,'{"style":"background-color:'+color+'"}');
    badgeContainer.appendChild(projBadge);

    var projContainer = createTagElement('div', 'col-9');
    var projLink = createTagElement('a', 'btn btn-light project-tasks','project-name-'+id,'{"href":"#"}');
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
    var button = createTagElement('button', 'btn btn-secondary prevented edit-project', '', '{"href":"#", "innerText":"Edit"}');
    button.dataset['url'] = url;
    button.dataset['method']='put';
    button.dataset['projectid'] = id;
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented delete-project', '', '{"href":"#", "innerText":"Delete"}');
    button.dataset['url'] = url;
    button.dataset['method']='delete';
    button.dataset['projectid'] = id;
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

    var outerContainer = createTagElement('div', 'col-11 offset-sm-1 row align-items-center all-tasks-container', 'task-'+task.id);
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
    if (timeleft < 0 || timeleft < (24*3600000)){
        taskDeadline.className += ' burning'
    } else if ((24*3600000) <= timeleft && timeleft < (48*3600000)){
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
    var projectLink = createTagElement('a', 'btn btn-light btn-sm project-tasks','','{"href":"#"}');
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
    var button = createTagElement('button', 'btn btn-secondary prevented done-task', '', '{"href":"#", "innerText":"Done"}');
    button.dataset['url'] = task.url;
    button.dataset['taskProject'] = task.project.id;
    button.dataset['method']='put';
    button.dataset['taskid'] = 'task-'+task.id;
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented edit-task', '', '{"href":"#", "innerText":"Edit"}');
    button.dataset['url'] = task.url;
    button.dataset['method']='put';
    button.dataset['taskid'] = 'task-'+task.id;
    button.dataset['taskTitle'] = task.title;
    button.dataset['taskProject'] = task.project.id;
    button.dataset['taskPriority'] = task.priority;
    button.dataset['taskDeadline'] = task.deadline;
    container.appendChild(button);
    button = createTagElement('button', 'btn btn-secondary prevented delete-task', '', '{"href":"#", "innerText":"Delete"}');
    button.dataset['url'] = task.url;
    button.dataset['method']='delete';
    button.dataset['taskid'] = 'task-'+task.id;
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
    title = data.name
    createTasksList(res, title+" tasks");
}

function getProjectCreationForm(url){
    var parentContainer = document.getElementById('projects');
    var outerContainer = createTagElement('div','col-12 row', 'project-form');

    var container = createTagElement('div', 'col-2 form-group')
    var color = createTagElement('input', 'form-control','color-input','{"name":"color-input", "type":"color", "value":"#fff"}');
    color.style = 'width: 40px; height: 40px; border-radius: 50%;';
    container.appendChild(color);
    outerContainer.appendChild(container);

    container = createTagElement('div', 'col-10 form-group')
    var input = createTagElement('input', 'form-control','name-input','{"name":"name-input", "type":"text", "placeholder":"Name"}');
    container.appendChild(input);
    outerContainer.appendChild(container);

//    container = createTagElement('div', 'col-10 offset-sm-1 form-group')
//    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"CREATE"}');
//    button.dataset['url'] = url;
//    button.addEventListener('click', createProject);
//    container.appendChild(button);
//    outerContainer.appendChild(container);

    innerContainer = createTagElement('div','col-12 row');
    container = createTagElement('div', 'col-4');
    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"Save"}');
    button.dataset['url'] = url;
    button.addEventListener('click', createProject);
    container.appendChild(button);
    innerContainer.appendChild(container);
    container = createTagElement('div', 'col-4');
    var button = createTagElement('button','btn btn-secondary btn-block','cancel-btn','{"innerText":"Cancel"}');
    button.dataset['url'] = url;
    button.addEventListener('click', function(){
        parentContainer.removeChild(outerContainer);
        var el = document.getElementsByClassName('edit-project');
        for (var i=0; i < el.length; i++){
            el.item(i).disabled=false;
        }
        var btn = document.getElementById('add-project-button');
        btn.disabled = false;

    });
    container.appendChild(button);
    innerContainer.appendChild(container);
    outerContainer.appendChild(innerContainer);

    parentContainer.appendChild(outerContainer);
}

function taskCreationEditForm(url, values=null, is_edit=false){

    var title = '';
    var priority = '';
    var project = '';
    var deadline = '';
    if(values){
        title = values['title'];
        priority = values['priority'];
        project = values['project'];
        deadline = values['deadline'];
    }

    var parentContainer = createTagElement('div','col-11 offset-sm-1 row', 'task-form');
    var container = createTagElement('div', 'col form-group')
    var input = createTagElement('input', 'form-control','title-input','{"name":"title-input", "type":"text", "placeholder":"Title"}');
    var label = createTagElement('label','form-check-label','','{"for":"title-input", "innerText": "Title"}');
    if (title.length) {input.value = title;}
    container.appendChild(label);
    container.appendChild(input);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col form-group')
    var input = createTagElement('select','form-control','project-input','{"name":"project-input"}');
    var label = createTagElement('label','form-check-label','','{"for":"project-input", "innerText": "Project"}');
    projects.forEach(function(project){
        var option = createTagElement('option');
        option.value = project.id;
        option.innerText = project.name;
        input.appendChild(option);
    });
    if (project.length) {input.value = project;}
    container.appendChild(label);
    container.appendChild(input);

    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col form-group')
    var input = createTagElement('select','form-control','priority-input','{"name":"priority-input"}');
    var label = createTagElement('label','form-check-label','','{"for":"priority-input", "innerText": "Priority"}');
    PRIORITIES.forEach(function(prio){
        var option = createTagElement('option');
        option.value = prio[0];
        option.innerText = prio[1];
        input.appendChild(option);
    });
    if (priority.length) {input.value = priority;}
    container.appendChild(label);
    container.appendChild(input);
    parentContainer.appendChild(container);

    var container = createTagElement('div', 'col form-group')
    var input = createTagElement('input', 'form-control','date-input','{"name":"date-input", "type":"datetime-local", "placeholder": "YYYY MM DD HH:mm" }' );
    var label = createTagElement('label','form-check-label','','{"for":"date-input", "innerText": "Deadline"}');
    if (deadline.length) {input.value = deadline;}
    container.appendChild(label);
    container.appendChild(input);
    parentContainer.appendChild(container);


    return parentContainer;
}

function getTaskCreationForm(url){

    var priorities = PRIORITIES;

    var parent = document.getElementById('add-task');
    var formContainer = taskCreationEditForm(url);

    var buttonContainer = createTagElement('div','col-12 row justify-content-center');
    var container = createTagElement('div', 'col-2 form-group')
    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"Create"}');
    button.dataset['url'] = url;
    button.addEventListener('click', createTask);
    container.appendChild(button);
    buttonContainer.appendChild(container);

    var container = createTagElement('div', 'col-2 form-group')
    var button = createTagElement('button','btn btn-secondary btn-block','update-btn','{"innerText":"Cancel"}');
    button.addEventListener('click', function(){
        parent.removeChild(formContainer);
        var el = document.getElementsByClassName('edit-task');
        for (var i=0; i < el.length; i++){
            el.item(i).disabled=false;
        }
        var btn = document.getElementById('add-task-button');
        btn.disabled = false;

    });
    container.appendChild(button);
    buttonContainer.appendChild(container);
    formContainer.appendChild(buttonContainer);
    parent.appendChild(formContainer);

}

function getTaskEditForm(url, id, title, priority, project, deadline){
    var old = document.getElementById(id);
    var parent = old.parentNode;
    var values = {
        title: title,
        project: project,
        deadline: deadline,
        priority: priority
    }

    var formContainer = taskCreationEditForm(url, values, true);
    var buttonContainer = createTagElement('div','col-12 row justify-content-center');
    var container = createTagElement('div', 'col-2 form-group')
    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"Save"}');
    button.dataset['url'] = url;
    button.addEventListener('click', editTask);
    container.appendChild(button);
    buttonContainer.appendChild(container);

    var container = createTagElement('div', 'col-2 form-group')
    var button = createTagElement('button','btn btn-secondary btn-block','update-btn','{"innerText":"Cancel"}');
    button.addEventListener('click', function(){
        parent.replaceChild(old, formContainer);
        var el = document.getElementsByClassName('edit-task');
        for (var i=0; i < el.length; i++){
            el.item(i).disabled=false;
        }
        var btn = document.getElementById('add-task-button');
        btn.disabled = false;
//        el.forEach(function(item){
//            item.disabled=false;
//        });
    });
    container.appendChild(button);
    buttonContainer.appendChild(container);
    formContainer.appendChild(buttonContainer);
    parent.replaceChild(formContainer, old);

}

function getProjectEditForm(url, id){

    var old = document.getElementById('proj-'+id);
    var parent = old.parentNode;
    var color = document.getElementById('project-color-'+id).style.backgroundColor;
    var name = document.getElementById('project-name-'+id).innerText;
    var colorIn = createTagElement('input', 'form-control','color-input','{"name":"color-input", "type":"color"}');
    colorIn.value = color;
    colorIn.style = 'width: 40px; height: 40px; border-radius: 50%;';
    var nameIn = createTagElement('input', 'form-control','name-input','{"name":"name-input", "type":"text", "placeholder":"Name"}');
    nameIn.value = name;
    var outerContainer = createTagElement('div', 'row', 'edit-proj-'+id);
    var innerContainer = createTagElement('div', 'col-12 row');
    var container = createTagElement('div', 'col-3 form-group');
    container.appendChild(colorIn);
    innerContainer.appendChild(container);
    container = createTagElement('div', 'col-9 form-group');
    container.appendChild(nameIn);
    innerContainer.appendChild(container);
    outerContainer.appendChild(innerContainer);
    innerContainer = createTagElement('div','col-12 row');
    container = createTagElement('div', 'col-4');
    var button = createTagElement('button','btn btn-primary btn-block','update-btn','{"innerText":"Save"}');
    button.dataset['url'] = url;
    button.addEventListener('click', editProject);
    container.appendChild(button);
    innerContainer.appendChild(container);
    container = createTagElement('div', 'col-4');
    var button = createTagElement('button','btn btn-secondary btn-block','cancel-btn','{"innerText":"Cancel"}');
    button.dataset['url'] = url;
    button.addEventListener('click', function(){
        parent.replaceChild(old, outerContainer);
        var el = document.getElementsByClassName('edit-project');
        for (var i=0; i < el.length; i++){
            el.item(i).disabled=false;
        }
        var btn = document.getElementById('add-project-button');
        btn.disabled = false;

    });
    container.appendChild(button);
    innerContainer.appendChild(container);
    outerContainer.appendChild(innerContainer);
    parent.replaceChild(outerContainer, old);

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

function getProjectTasks(url){

    $.ajax({
        url: url,
        type:'GET',
        dataType:'json',
        success: function(data){
            projectTasksListCallback(data);
            setTimeout(function(){$('#proj-'+data.id).toggleClass('selected-project', true);}, 300);
        }
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
            getProjectTasks(data.project.url);

            var form = document.getElementById('task-form');
            form.parentNode.removeChild(form);
            $('#add-task-button').prop('disabled', false);
            $('.edit-task').prop('disabled', false);
        },
    });
}

function editTask(e){
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
        type: 'PUT',
        dataType: 'json', // Set datatype - affects Accept header
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
        },
        success: function(data){
            getAllProjects();
            getProjectTasks(data.project.url);
            $('#add-task-button').prop('disabled', false);
            $('.edit-task').prop('disabled', false);
        },
    });
}

function deleteTask(e){
    var url = e.currentTarget.dataset['url'];
    $.ajax({
        url: url,
        type: 'DELETE',
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

function finishTask(e){
    var url = e.currentTarget.dataset['url'];
    var project = parseInt(e.currentTarget.dataset['taskProject']);
    var data = {
        is_done: true,
        project: project,
    }
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: 'PATCH',
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

function createProject(e){
    var url = e.currentTarget.dataset['url'];
    var data = {
        name: document.getElementById('name-input').value,
        color: document.getElementById('color-input').value,
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
            $('#add-project-button').prop('disabled', false);
            $('.edit-project').prop('disabled', false);
        },
    });
}

function editProject(e){
    var url = e.currentTarget.dataset['url'];
    var data = {
        name: document.getElementById('name-input').value,
        color: document.getElementById('color-input').value,
    }
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: 'PUT',
        dataType: 'json', // Set datatype - affects Accept header
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
        },
        success: function(data){
            getAllProjects();
            getTodayTasks();
            $('#add-project-button').prop('disabled', false);
            $('.edit-project').prop('disabled', false);
        },
    });
}

function deleteProject(e){
    var url = e.currentTarget.dataset['url'];
    $.ajax({
        url: url,
        type: 'DELETE',
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