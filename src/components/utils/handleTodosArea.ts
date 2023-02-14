import { TodosPlacement } from '../../types/types';

export const handleTodosArea = (todosPlacement: TodosPlacement[]) => {
  let currentArray = 0;
  const result: TodosPlacement[][] = [];
  todosPlacement.forEach((todo, index) => {
    const nextTodo = todosPlacement[index + 1];
    if (nextTodo && index > 0) {
      if (todo.column < nextTodo.column) {
        result[currentArray].push(todo);
      } else {
        result[currentArray].push(todo);
        result.push([]);
        currentArray += 1;
      }
    } else if (!nextTodo) {
      result[currentArray].push(todo);
    } else {
      result.push([todo]);
    }
  });
  return result;
};

export const calculateItemHeight = (
  start: number,
  end: number,
  heightPerHalfHour: number,
) => {
  const durationInMinutes = (end - start) / 1000 / 60;
  const height = (durationInMinutes / 30) * heightPerHalfHour;
  return height;
};

export const calculateItemWidth = (arrLength: number, maxTodoWidth: number) => {
  const width = maxTodoWidth / arrLength;
  return width;
};

// export const calculateTop = () => {

// }

// export const calculateLeft = () => {

// }
