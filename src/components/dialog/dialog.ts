import { BaseComponent } from "../component.js";
import { MediaSectionInput } from "./input/media-input.js";
import { TextSectionInput } from "./input/text-input.js";

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

interface InputSection {
  new (): MediaSectionInput;
}

export class InputDialog extends BaseComponent {
  closeListener?: OnCloseListener;
  submitListener?: OnSubmitListener;
  mediaOrTextInput?: InputSection;
  constructor() {
    super(`<section class="dialog">
                <div class="dialog__container">
                    <button class="close">&times;</button>
                    <div id="dialog__body"></div>
                    <button class="dialog__submit">ADD</button>
                </div>
            </section>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    const submitBtn = this.element.querySelector(
      ".dialog__submit"
    )! as HTMLButtonElement;
    submitBtn.onclick = () => {
      this.submitListener && this.submitListener();
    };
  }
  setOnCloseListener(closeEvent: OnCloseListener) {
    this.closeListener = closeEvent;
  }
  setOnSubmitListener(submitEvent: OnSubmitListener) {
    this.submitListener = submitEvent;
  }
  addChild(element: MediaSectionInput | TextSectionInput) {
    const body = this.element.querySelector("#dialog__body")! as HTMLElement;
    element.attachTo(body);
  }
}
