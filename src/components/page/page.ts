import { BaseComponent, Component } from "../component.js";

type OnCloseListener = () => void;

interface SectionContainer extends Component, Composable {
  setOnCloseListener(closeEvent: OnCloseListener): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

interface Composable {
  addChild(component: Component): void;
}

export class PageItemComponent
  extends BaseComponent
  implements SectionContainer
{
  closeListener?: OnCloseListener;
  constructor() {
    super(`<li class="page-item">
                <section class="page-item__body"></section>
                <div class="page-item__controls">
                  <button class="close">&times;</button>
                </div>
              </li>`);
    const button = this.element.querySelector(".close")! as HTMLButtonElement;
    button.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  addChild(component: Component) {
    const body = this.element.querySelector(".page-item__body")! as HTMLElement;
    component.attachTo(body);
  }

  setOnCloseListener(closeEvent: OnCloseListener) {
    this.closeListener = closeEvent;
  }
}

export class PageComponent extends BaseComponent {
  constructor(
    private sectionContainerConstructor: SectionContainerConstructor
  ) {
    super(`<ul class="page">This is PageComponent</ul>`);
  }
  addChild(component: BaseComponent) {
    const item = new this.sectionContainerConstructor();
    item.addChild(component);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
  }
}
