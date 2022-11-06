import { BaseComponent, Component } from "../component.js";

type OnCloseListener = () => void;
type OnDragListener = (target: SectionContainer, state: DragState) => void;

type DragState = "start" | "end" | "enter" | "leave";

interface SectionContainer extends Component, Composable {
  setOnCloseListener(closeEvent: OnCloseListener): void;
  setOnDragListener(dragEvent: OnDragListener): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped():void;
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
  dragStateListener?: OnDragListener;
  constructor() {
    super(`<li draggable='true' class="page-item">
                <section class="page-item__body"></section>
                <div class="page-item__controls">
                  <button class="close">&times;</button>
                </div>
              </li>`);
    const button = this.element.querySelector(".close")! as HTMLButtonElement;
    button.onclick = () => {
      this.closeListener && this.closeListener();
    };
    this.element.addEventListener("dragstart", () => {
      this.dragAction("start");
      this.element.classList.add("lifted");
    });
    this.element.addEventListener("dragend", () => {
      this.dragAction("end");
      this.element.classList.remove("lifted");
    });
    this.element.addEventListener("dragenter", () => {
      this.dragAction("enter");
      this.element.classList.add("drop-area");
    });
    this.element.addEventListener("dragleave", () => {
      this.dragAction("leave");
      this.element.classList.remove("drop-area");
    });
  }
  onDropped(){
    this.element.classList.remove('drop-area');
  }
  addChild(component: Component) {
    const body = this.element.querySelector(".page-item__body")! as HTMLElement;
    component.attachTo(body);
  }
  setOnCloseListener(closeEvent: OnCloseListener) {
    this.closeListener = closeEvent;
  }

  // 드래그관련
  dragAction(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }
  setOnDragListener(dragEvent: OnDragListener) {
    this.dragStateListener = dragEvent;
  }
  muteChildren(state: "mute" | "unmute") {
    if (state == "mute") {
      this.element.classList.add("mute-children");
    } else {
      this.element.classList.remove("mute-children");
    }
  }
  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent extends BaseComponent {
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;
  constructor(
    private sectionContainerConstructor: SectionContainerConstructor
  ) {
    super(`<ul class="page"></ul>`);
    this.element.addEventListener("dragover", (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener("drop", (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("drag");
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
      this.dropTarget.onDropped();
    }
  }

  addChild(component: BaseComponent) {
    const item = new this.sectionContainerConstructor();
    item.addChild(component);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragListener((target: SectionContainer, state: DragState) => {
      switch (state) {
        case "start":
          this.updateSection("mute");
          this.dragTarget = target;
          break;
        case "end":
          this.dragTarget = undefined;
          this.updateSection("unmute");
          break;
        case "enter":
          console.log("enter");
          this.dropTarget = target;
          break;
        case "leave":
          console.log("leave");
          this.dropTarget = undefined;
          break;
      }
    });
  }
  private updateSection(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
