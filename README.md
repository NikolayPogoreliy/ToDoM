Приложение ToDoManager. Управление списком дел, сгрупированных по проектам. Предусмотрена возможность создавать, редактировать и удалять как задачи, так и проекты в целом.
Для каждой задачи задается срок выполнения - дэдлайн. Если до конца срока остается более 48 часов - строка дэдлайна отображается серым цветом. Если от 48 до 24-х часов, то желтым. Если менее 24 - красным.
Задачи с истекшим дедлайном подсвечены красным, выполненные задачи - серым.
В строке проекта есть счетчик задач (выплнено/всего). Если проект содержит "просроченные" задачи - счетчик отображается красным, если все задачи завершены - зеленым цветом.
Удалить можно только проект, все задачи которого завершены.

Использовалось:
Back-end (см. requirements.txt) :
    Python==3.6.4
    Django==1.11
    DRF==3.8.2

Front-end:
    HTML5
    CSS3
    JavaScript (for rendering)
    jQuery 3.3.1 (for requests and events handling)