import { BaseComponent } from "../../component.js";

export class NoteComponent extends BaseComponent{
  constructor() {
    super(`<section class="note">
        <h2 class="note__title">내가노트다</h2>
        <p class="note__body">맞나?</p>
    </section>`);
  }
}
