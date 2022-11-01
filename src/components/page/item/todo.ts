import { BaseComponent } from "../../component.js";

export class ToDoComponent extends BaseComponent {
  constructor() {
    super(`<section class="todo">
        <h2 class="todo__title">todo에염</h2>
        <input type="checkbox" class="todo-checkbox">
    </section>`);
  }
}
