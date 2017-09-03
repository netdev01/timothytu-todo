$(function() {

  // The taskHtml method takes in a JavaScript representation
  // of the task and produces an HTML representation using
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : "";
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">'
    + '<div class="view">'
    + '<input class="toggle" type="checkbox" data-id=' + task.id + ' ' + checkedStatus + '>'
    + '<label>' + task.title + '</label>'
    + '<button class="destroy" data-id=' + task.id + '></button>'
    + '</div></li>';

    return liElement;
  }

  // toggleTask takes in an HTML representation of
  // an event that fires from an HTML representation of
  // the toggle checkbox and  performs an API request to toggle
  // the value of the `done` field
  function toggleTask(e) {
    var itemId = $(e.target).data("id");
    var doneValue = Boolean($(e.target).is(':checked'));
    console.log('toggleTask ' + itemId + ', done:' + doneValue + ' ' + e.target);
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      console.log('/tasks/' + itemId + ' put success, ' + data.id);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    } );
  }

  // deleteTask deletes the selected task and
  // reload the task list
  function deleteTask(e) {
    var itemId = $(e.target).data("id");
    console.log('deleteTask ' + itemId + ' ' + e.target);
    $.post("/tasks/" + itemId, {
      _method: "DELETE"
    }).success(function(data) {
      loadTasks(data);
    } );
  }

  function loadTasks(data) {
    var htmlString = "";
    $.each(data, function(index,  task) {
      htmlString += taskHtml(task);       // create html for each task
    });
    // console.log(htmlString);
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);             // insert the tasks to page
    $('.toggle').change(toggleTask); 
  }

  // Create the task list on loading
  $.get("/tasks").success(function(data) {
    loadTasks(data);
  });

  // Attach events to dynamtic created elements
  $('.todo-list').on('click', '.destroy', function(event) {
    deleteTask(event);
  });

  $('#new-form').submit(function(event) {
    event.preventDefault();
    var textbox = $('.new-todo');
    // console.log("Task: ", textbox.val());
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    // console.log(payload);
    $.post("/tasks", payload).success(function(data) {
      // console.log(data);
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    });
  });

});
