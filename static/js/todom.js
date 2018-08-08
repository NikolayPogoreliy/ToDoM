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
    $('.finished-tasks').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getFinishedTasks();
    });
    $('.burning-tasks').on('click', function(e){
        e.preventDefault();
        $('.selected-project').toggleClass('selected-project', false);
        getBurningTasks();
    });
    $('main').on('click', '.project-tasks', function(e){
        e.preventDefault();
        var id = e.currentTarget.dataset['projectid'];
        $('.selected-project').toggleClass('selected-project', false);
        $('#'+id).toggleClass('selected-project', true);
        getProjectTasks(e);
    })
    $('.add-task').on('click', function(e){
        e.preventDefault();
        getTaskCreationForm('/projects/tasks/');
    });
});