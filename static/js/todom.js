$(document).ready(function(){
    var projects = null;

    getAllProjects();
    getTodayTasks();

    $('.weekly-tasks').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getWeeklyTasks();
    });
    $('.todays-tasks').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getTodayTasks();
    });
    $('#finished-task-button').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getFinishedTasks();
    });
    $('#burning-task-button').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getBurningTasks();
    });
    $('main').on('click', '.project-tasks', function(e){
        e.preventDefault();
        var url = e.currentTarget.dataset['url'];
        var id = e.currentTarget.dataset['projectid'];
        $('.selected-project').toggleClass('selected-project', false);
//        $('#'+id).toggleClass('selected-project', true);
        getProjectTasks(url);
    })
    $('.add-task').on('click', function(e){
        e.preventDefault();
        $('#add-task-button').prop('disabled', true);
        $('.edit-task').prop('disabled', true);
        getTaskCreationForm('/projects/tasks/');
    });
    $('#tasks').on('click','.edit-task', function(e){
        e.preventDefault();
        var url = e.currentTarget.dataset['url'];
        var id = e.currentTarget.dataset['taskid'];
        var title = e.currentTarget.dataset['taskTitle'];
        var project = e.currentTarget.dataset['taskProject'];
        var priority = e.currentTarget.dataset['taskPriority'];
        var deadline = e.currentTarget.dataset['taskDeadline'];
        $('#add-task-button').prop('disabled', true);
        $('.edit-task').prop('disabled', true);
        getTaskEditForm(url, id, title,priority,project,deadline);
    });
    $('#tasks').on('click','.done-task', function(e){
        e.preventDefault();
        finishTask(e);
    });
    $('#tasks').on('click','.delete-task', function(e){
        e.preventDefault();
        deleteTask(e);
    });
    $('.add-project').on('click', function(e){
        e.preventDefault();
        getProjectCreationForm('/projects/');
        $('#add-project-button').prop('disabled', true);
        $('.edit-project').prop('disabled', true);
    });
    $('#projects').on('click','.edit-project', function(e){
        e.preventDefault();
        var url = e.currentTarget.dataset['url'];
        var id = e.currentTarget.dataset['projectid'];
        getProjectEditForm(url, id);
        $('#add-project-button').prop('disabled', true);
        $('.edit-project').prop('disabled', true);
    });
    $('#projects').on('click','.delete-project', function(e){
        e.preventDefault();
        deleteProject(e);
    });
});