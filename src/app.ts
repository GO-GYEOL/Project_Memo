import { ToDoComponent } from "./components/page/item/todo.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { PageComponent, PageItemComponent } from "./components/page/page.js";
import { VideoComponent } from "./components/page/item/video.js";

class App {
  pageComponent: PageComponent;

  constructor(appRoot: HTMLElement) {
    this.pageComponent = new PageComponent(PageItemComponent);
    this.pageComponent.attachTo(appRoot);

    const videoComponent = new VideoComponent();
    this.pageComponent.addChild(videoComponent);

    const imageComponent = new ImageComponent();
    this.pageComponent.addChild(imageComponent);
  }
}

new App(document.querySelector(".document")!);
